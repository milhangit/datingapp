#!/usr/bin/env node

/**
 * Script to change admin password
 *
 * Usage:
 *   node change-admin-password.js <newPassword>
 *
 * Or to just get the hash:
 *   node change-admin-password.js <newPassword> --hash-only
 */

const crypto = require('crypto');

// Get password from command line
const password = process.argv[2];
const hashOnly = process.argv.includes('--hash-only');

if (!password) {
  console.error('❌ Error: Please provide a password');
  console.log('\nUsage:');
  console.log('  node change-admin-password.js <newPassword>');
  console.log('  node change-admin-password.js <newPassword> --hash-only');
  console.log('\nExample:');
  console.log('  node change-admin-password.js MySecurePassword123!');
  process.exit(1);
}

// Hash the password using SHA-256 (same as in worker.js)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const passwordHash = hashPassword(password);

console.log('\n🔐 Password Hash Generated!\n');
console.log('Password:', password);
console.log('Hash:', passwordHash);

if (hashOnly) {
  console.log('\n📋 Copy the hash above and use it in your SQL command.');
  process.exit(0);
}

console.log('\n📝 To update the admin password in D1, run this command:\n');
console.log(`wrangler d1 execute datingapp-db --remote --command="UPDATE admins SET passwordHash = '${passwordHash}' WHERE username = 'admin';"`);

console.log('\n✅ After running the command above, you can login with:');
console.log('   Username: admin');
console.log('   Password:', password);
console.log('\n🔒 Keep this password safe!\n');
