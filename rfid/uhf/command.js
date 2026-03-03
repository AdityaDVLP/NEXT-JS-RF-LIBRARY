import { calculateChecksum } from './utils'

export class Command {
  constructor(command, address = 0xff, data = []) {
    if (!(command instanceof Uint8Array)) command = new Uint8Array(command)
    if (command.length !== 2) throw new Error('Command must be exactly 2 bytes.')
    this.command = command
    this.address = address
    this.data = data instanceof Uint8Array ? data : new Uint8Array(data)
  }

  serialize(withChecksum = true) {
    const base = [0xcf, this.address, this.command[0], this.command[1], this.data.length, ...this.data]
    let frame = new Uint8Array(base)
    if (withChecksum) {
      const cv = calculateChecksum(frame)
      const cb = new Uint8Array([(cv >> 8) & 0xff, cv & 0xff])
      const full = new Uint8Array(frame.length + 2)
      full.set(frame, 0); full.set(cb, frame.length)
      frame = full
    }
    return frame
  }
}
