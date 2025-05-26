require('dotenv').config();
const db = require('./src/config/database');

async function updateDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Add google_id column if it doesn't exist
    await addColumnIfNotExists('users', 'google_id', 'VARCHAR(255) NULL');
    
    // Add phone column if it doesn't exist
    await addColumnIfNotExists('users', 'phone', 'VARCHAR(20) NULL');
    
    // Add phone_verified column if it doesn't exist
    await addColumnIfNotExists('users', 'phone_verified', 'TINYINT(1) NOT NULL DEFAULT 0');
    
    // Add email_verified column if it doesn't exist
    await addColumnIfNotExists('users', 'email_verified', 'TINYINT(1) NOT NULL DEFAULT 0');
    
    // Add email_verification_token column if it doesn't exist
    await addColumnIfNotExists('users', 'email_verification_token', 'VARCHAR(255) NULL');
    
    // Add birth_date column if it doesn't exist
    await addColumnIfNotExists('users', 'birth_date', 'VARCHAR(20) NULL');
    
    console.log('Database update completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

async function addColumnIfNotExists(table, column, definition) {
  try {
    // Check if column exists
    const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
    
    if (columns.length === 0) {
      // Column doesn't exist, add it
      console.log(`Adding ${column} column to ${table} table...`);
      await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`Column ${column} added successfully!`);
    } else {
      console.log(`${column} column already exists in ${table} table.`);
    }
  } catch (error) {
    console.error(`Error adding column ${column}:`, error);
    throw error;
  }
}

updateDatabase();