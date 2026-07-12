const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 12

const users = [
  { fullName: 'System Admin',   email: 'admin@gmail.com',  password: 'Admin@123',  phone: '9800000000', role: 'admin' },
  { fullName: 'Prabin Koirala', email: 'prabin@gmail.com', password: 'Prabin@123', phone: '9811111111', role: 'admin' },
  { fullName: 'Ritika Gautam',  email: 'ritika@gmail.com', password: 'Ritika@123', phone: '9822222222', role: 'staff' },
  { fullName: 'Sujan Thapa',    email: 'sujan@gmail.com',  password: 'Sujan@123',  phone: '9833333333', role: 'staff' },
  { fullName: 'Anisha Sharma',  email: 'anisha@gmail.com', password: 'Anisha@123', phone: '9844444444', role: 'staff' },
  { fullName: 'Rohan KC',       email: 'rohan@gmail.com',  password: 'Rohan@123',  phone: '9855555555', role: 'staff' },
]

async function main() {
  const rows = await Promise.all(
    users.map(async (u) => {
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS)
      return { ...u, hash }
    })
  )

  console.log('\n-- ===========================')
  console.log('-- SEED DATA  (auto-generated)')
  console.log('-- Default passwords: Name@123')
  console.log('-- ===========================\n')
  console.log('INSERT INTO users (full_name, email, password_hash, phone, role) VALUES')

  const values = rows.map(
    (r, i) =>
      `  ('${r.fullName}', '${r.email}', '${r.hash}', '${r.phone}', '${r.role}')${i < rows.length - 1 ? ',' : ''}`
  )
  console.log(values.join('\n'))
  console.log('ON CONFLICT (email) DO NOTHING;\n')

  console.log('-- Credentials summary:')
  rows.forEach((r) => {
    console.log(`-- ${r.role.padEnd(5)}  ${r.email.padEnd(22)}  ${r.password}`)
  })
}

main().catch(console.error)
