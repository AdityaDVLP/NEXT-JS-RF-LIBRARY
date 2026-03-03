export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export function toHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
}

export function calculateChecksum(data) {
  let value = 0xffff
  for (let byte of data) {
    value ^= byte
    for (let i = 0; i < 8; i++) {
      value = (value & 0x0001) !== 0 ? (value >> 1) ^ 0x8408 : value >> 1
    }
  }
  return value
}
