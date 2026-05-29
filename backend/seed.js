const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  const hash = await bcrypt.hash('Admin@ZUT2026', 10);

  await db.query(
    'UPDATE users SET password = $1 WHERE email = $2',
    [hash, 'admin@zut.ac.zm']
  );

  console.log('Admin password updated successfully');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});