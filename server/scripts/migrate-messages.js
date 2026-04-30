const { sequelize } = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Starting database migration for Messages email tracking...');
    
    // Add emailSent column
    await sequelize.query(`
      ALTER TABLE "Messages" 
      ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false;
    `);
    console.log('✅ Added emailSent column to Messages table');
    
    // Verify the column exists
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Messages' 
      AND column_name = 'emailSent';
    `);
    
    if (results.length > 0) {
      console.log('✅ Migration verified successfully!');
      console.log('   Column details:', results[0]);
    } else {
      console.log('⚠️  Warning: Could not verify column creation');
    }
    
    console.log('\n🎉 Database migration completed successfully!');
    console.log('   Staff can now send email messages to customers.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Database is running');
    console.error('2. Database credentials in .env are correct');
    console.error('3. You have ALTER TABLE permissions');
    process.exit(1);
  }
}

// Run migration
runMigration();
