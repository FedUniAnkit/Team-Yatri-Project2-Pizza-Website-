const { sequelize } = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Starting database migration for Stripe payment integration...');
    
    // Add stripePaymentIntentId column
    await sequelize.query(`
      ALTER TABLE "Orders" 
      ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" VARCHAR(255);
    `);
    console.log('✅ Added stripePaymentIntentId column to Orders table');
    
    // Add index for faster lookups
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent 
      ON "Orders"("stripePaymentIntentId");
    `);
    console.log('✅ Created index on stripePaymentIntentId column');
    
    // Verify the column exists
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Orders' 
      AND column_name = 'stripePaymentIntentId';
    `);
    
    if (results.length > 0) {
      console.log('✅ Migration verified successfully!');
      console.log('   Column details:', results[0]);
    } else {
      console.log('⚠️  Warning: Could not verify column creation');
    }
    
    console.log('\n🎉 Database migration completed successfully!');
    console.log('   You can now use Stripe payment integration.');
    
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
