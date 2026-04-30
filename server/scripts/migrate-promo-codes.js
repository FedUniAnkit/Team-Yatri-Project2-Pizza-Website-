const { sequelize } = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Starting database migration for promo code enhancements...');
    
    // Add usageLimit column
    await sequelize.query(`
      ALTER TABLE "Promotions" 
      ADD COLUMN IF NOT EXISTS "usageLimit" INTEGER DEFAULT NULL;
    `);
    console.log('✅ Added usageLimit column');
    
    // Add usageCount column
    await sequelize.query(`
      ALTER TABLE "Promotions" 
      ADD COLUMN IF NOT EXISTS "usageCount" INTEGER DEFAULT 0;
    `);
    console.log('✅ Added usageCount column');
    
    // Add minimumOrderAmount column
    await sequelize.query(`
      ALTER TABLE "Promotions" 
      ADD COLUMN IF NOT EXISTS "minimumOrderAmount" DECIMAL(10, 2) DEFAULT 0;
    `);
    console.log('✅ Added minimumOrderAmount column');
    
    // Add maxDiscountAmount column
    await sequelize.query(`
      ALTER TABLE "Promotions" 
      ADD COLUMN IF NOT EXISTS "maxDiscountAmount" DECIMAL(10, 2) DEFAULT NULL;
    `);
    console.log('✅ Added maxDiscountAmount column');
    
    // Verify the columns exist
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Promotions' 
      AND column_name IN ('usageLimit', 'usageCount', 'minimumOrderAmount', 'maxDiscountAmount');
    `);
    
    if (results.length === 4) {
      console.log('✅ Migration verified successfully!');
      console.log('   All 4 columns added:');
      results.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('⚠️  Warning: Expected 4 columns, found', results.length);
    }
    
    console.log('\n🎉 Database migration completed successfully!');
    console.log('   Promo codes now support:');
    console.log('   - Usage limits');
    console.log('   - Usage tracking');
    console.log('   - Minimum order amounts');
    console.log('   - Maximum discount caps');
    
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
