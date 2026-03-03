import { calculateChecksum, toHex } from './utils'

export class Response {
  constructor(frame) {
    if (!(frame instanceof Uint8Array)) throw new TypeError('Response expects Uint8Array')
    if (frame.length < 6) throw new Error('Frame too short.')
    this.bytes = frame
    this.header = frame[0]
    this.readerAddress = frame[1]
    this.commandHi = frame[2]; this.commandLo = frame[3]
    this.command = (this.commandHi << 8) | this.commandLo
    this.status = frame[4]
    this.data = frame.slice(5, -2)
    this.checksum = frame.slice(-2)
  }
  get checksumValue() { return (this.checksum[0] << 8) | this.checksum[1] }
  validateChecksum() { return this.checksumValue === calculateChecksum(this.bytes.slice(0, -2)) }
}

export class Tag {
  constructor(data) {
    if (!(data instanceof Uint8Array)) throw new TypeError('Tag expects Uint8Array')
    if (data.length < 7) throw new Error(`Tag payload too short: ${data.length} bytes`)
    this.raw = data
    this.rssiRaw = new DataView(data.buffer, data.byteOffset, 2).getInt16(0, false)
    this.rssi = this.rssiRaw / 10
    this.antenna = data[2]; this.channel = data[3]; this.tagLength = data[4]
    const tagStart = 5, tagEnd = tagStart + this.tagLength
    if (tagEnd > data.length) throw new Error(`Tag length ${this.tagLength} exceeds payload`)
    this.tagData = data.slice(tagStart, tagEnd)
    this.remainder = data.slice(tagEnd)
    this.checksum = this.remainder.length === 2 ? (this.remainder[0] << 8) | this.remainder[1] : null
  }
  tagHex() { return toHex(this.tagData) }
}
