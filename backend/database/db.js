const { Pool } = require('pg')

const pool = process.env.DATABASE_URL
	? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl:
				process.env.PGSSL === 'true'
					? { rejectUnauthorized: false }
					: undefined,
		})
	: new Pool({
			host: process.env.PGHOST || 'localhost',
			port: Number(process.env.PGPORT || 5432),
			database: process.env.PGDATABASE || 'cafex',
			user: process.env.PGUSER || 'postgres',
			password: process.env.PGPASSWORD || 'Prabin',
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
