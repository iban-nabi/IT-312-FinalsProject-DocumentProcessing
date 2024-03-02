/**
 * Provides encryption for entered passwords on the login page before they 
 * are compared with the stored encrypted passwords on the database.
 * Author/s: Carl Joshua Lalwet
 */
const crypto = require('crypto');

function encryptString(message, key) {
  const cipher = crypto.createCipheriv('aes-256-ecb', key, Buffer.alloc(0));
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

module.exports = {encryptString}
