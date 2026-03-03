import { toHex } from './utils'
import { Response, Tag } from './response'
import { Command } from './command'

export class Reader {
  constructor(transport) { this.transport = transport }

  async request(command) {
    await this.transport.send(command.serialize())
  }

  async receive() {
    const headerSection = await this.transport.read(5)
    if (!headerSection || headerSection.length !== 5) return null
    const [header, , , , lenData] = headerSection
    if (header !== 0xcf) return null
    if (lenData < 0 || lenData > 255) return null
    const needBody = lenData + 2
    const bodySection = await this.transport.read(needBody)
    if (!bodySection || bodySection.length !== needBody) { this.transport.clear(); return null }
    const frame = new Uint8Array(5 + needBody)
    frame.set(headerSection, 0); frame.set(bodySection, 5)
    return new Response(frame)
  }

  async stopInventoryAnswerMode() {
    try { await this.request(new Command([0x00, 0x02], 0xff)) } catch {}
  }

  async *inventoryAnswerMode({ stopAfter = 0 } = {}) {
    const stopAfterBytes = new Uint8Array(4)
    new DataView(stopAfterBytes.buffer).setUint32(0, stopAfter, false)
    const cmd = new Command([0x00, 0x01], 0xff, new Uint8Array([0x00, ...stopAfterBytes]))
    try {
      await this.request(cmd)
      while (true) {
        const resp = await this.receive()
        if (!resp) continue
        if (!resp.validateChecksum()) { await this.transport.clear(); continue }
        const data = resp.data ?? new Uint8Array(0)
        if (data.length === 1 && data[0] === 0x12) return
        yield new Tag(data.slice(1))
      }
    } catch (e) { console.error('inventoryAnswerMode error:', e) }
  }
}
