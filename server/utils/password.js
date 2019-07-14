const bcrypt = require('bcrypt');

async function encryptString(value, rounds = 10) {
  return await bcrypt.hash(value, rounds);
}

async function compareEncryptedString(value, encryptedValue) {
  return await bcrypt.compare(value, encryptedValue);
}
		
module.exports = { encryptString, compareEncryptedString };