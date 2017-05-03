export function isRfid(rfid) {
  return typeof (rfid) === 'string' && /^\d{8,10}$/.test(rfid);
}
