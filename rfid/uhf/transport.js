import { delay } from './utils'

export class SerialTransport {
  port = null; reader = null; writer = null

  async open({ baudRate = 115200, bufferSize = 1024, dataBits = 8, stopBits = 1,
    parity = 'none', flowControl = 'none', filters, requestPort = true } = {}) {
    if (!this.port) {
      this.port = requestPort
        ? await navigator.serial.requestPort(filters ? { filters } : undefined)
        : (await navigator.serial.getPorts())[0] ?? null
      if (!this.port) throw new Error('No serial port selected')
    }
    if (!this.port.readable || !this.port.writable)
      await this.port.open({ baudRate, bufferSize, dataBits, stopBits, parity, flowControl })
    try { await this.port.setSignals?.({ dataTerminalReady: true, requestToSend: true }) } catch {}
    await delay(30)
    this.reader = this.port.readable?.getReader({ mode: 'byob' }) ?? null
    this.writer = this.port.writable?.getWriter() ?? null
  }

  async close() {
    try {
      if (this.reader) { this.reader.releaseLock(); this.reader = null }
      if (this.writer) { await this.writer.close().catch(() => {}); this.writer.releaseLock(); this.writer = null }
      if (this.port) await this.port.close().catch(() => {})
    } finally { this.port = null }
  }

  getDeviceInfo() {
    if (!this.port?.getInfo) return null
    const { usbVendorId, usbProductId } = this.port.getInfo()
    return { usbVendorId, usbProductId }
  }

  async send(data) {
    if (!this.writer) throw new Error('Port not writable')
    await this.writer.write(data)
  }

  async _receiveChunk(size) {
    if (!this.reader) throw new Error('Reader not initialized')
    if (size <= 0) return new Uint8Array(0)
    const byob = new Uint8Array(size)
    const { value, done } = await this.reader.read(byob)
    if (done) return new Uint8Array(0)
    return value?.byteLength === byob.byteLength ? byob : value.slice()
  }

  async read(size, { interChunkIdleMs = 20 } = {}) {
    const chunks = []; let received = 0
    while (received < size) {
      const want = Math.min(1024, size - received)
      try {
        const chunk = await this._receiveChunk(want)
        if (chunk.byteLength === 0) { await delay(interChunkIdleMs); continue }
        chunks.push(chunk); received += chunk.byteLength
      } catch (e) { console.error('read error:', e); return null }
    }
    if (chunks.length === 1) return chunks[0]
    const out = new Uint8Array(size); let off = 0
    for (const c of chunks) { out.set(c, off); off += c.byteLength }
    return out
  }

  async clear() {
    if (!this.reader) return
    await this.read(512)
  }
}
