const jwt = require('jsonwebtoken')

function signJwt(payload, expiresIn = '8h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

module.exports = { signJwt }