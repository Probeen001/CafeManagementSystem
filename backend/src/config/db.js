const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.PGSSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error)
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
}