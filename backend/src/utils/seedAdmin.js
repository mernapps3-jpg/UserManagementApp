const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ User ${adminEmail} promoted to admin`);
      } else {
        console.log(`ℹ️  Admin user ${adminEmail} already exists`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10); //fsdsdfgsd = @3q43345345435
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Default admin user created');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   ⚠️  Change password after first login!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
}

module.exports = seedAdmin;
