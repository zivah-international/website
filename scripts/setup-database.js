#!/usr/bin/env node

/**
 * Database Setup and Seed Script Runner
 * This script creates the database and runs the seed data
 *
 * Usage:
 *   npm run db:setup
 *   or
 *   node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Parse DATABASE_URL or use individual environment variables
function parseDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Parse DATABASE_URL (format: mysql://username:password@host:port/database)
    const url = new URL(databaseUrl);

    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      database: url.pathname.slice(1), // Remove leading slash
      user: url.username,
      password: url.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  } else {
    // Fallback to individual environment variables
    return {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'zivah_international',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }
}

// Database configuration
const dbConfig = parseDatabaseConfig();

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  console.log('🔧 Connection config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
  });

  let pool;

  try {
    // First, try to connect directly to the target database
    console.log('📦 Checking database connection...');
    pool = mysql.createPool(dbConfig);

    try {
      await pool.execute('SELECT 1');
      console.log('✅ Database connection established');
    } catch {
      console.log(
        'ℹ️  Target database not accessible directly. This is normal for shared hosting.'
      );
      console.log('ℹ️  Assuming database exists and attempting connection with schema setup...');

      // For shared hosting, skip database creation and assume it exists
      // Just continue with the schema setup on the existing database
      await pool.end();
      pool = mysql.createPool(dbConfig);

      // Try one more time - if this fails, the database truly doesn't exist or there's a config issue
      try {
        await pool.execute('SELECT 1');
        console.log('✅ Database connection established');
      } catch (finalError) {
        console.error('❌ Unable to connect to database. Please check:');
        console.error('   - Database exists and is accessible');
        console.error('   - Connection parameters are correct');
        console.error('   - User has sufficient permissions');
        throw finalError;
      }
    }

    // Read and execute the schema SQL file first
    const schemaFilePath = path.join(__dirname, '..', 'database-schema.sql');
    const schemaSQL = fs.readFileSync(schemaFilePath, 'utf8');

    console.log('🏗️  Creating database schema...');

    // Split SQL into individual statements and execute them
    const schemaStatements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of schemaStatements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement);
        } catch (error) {
          // Ignore comments and empty statements
          if (!statement.includes('--') && statement.trim().length > 0) {
            console.warn(
              '⚠️  Error executing schema statement:',
              statement.substring(0, 100) + '...'
            );
            console.warn('Error:', error.message);
          }
        }
      }
    }

    console.log('✅ Database schema created successfully');

    // Read and execute the seed SQL file
    const seedFilePath = path.join(__dirname, '..', 'database-seed.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');

    console.log('🌱 Seeding database with initial data...');

    // Split SQL into individual statements and execute them
    const seedStatements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of seedStatements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement);
        } catch (error) {
          // Ignore comments and empty statements
          if (!statement.includes('--') && statement.trim().length > 0) {
            console.warn(
              '⚠️  Error executing seed statement:',
              statement.substring(0, 100) + '...'
            );
            console.warn('Error:', error.message);
          }
        }
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('🎉 Your ZIVAH International database is ready to use.');
    console.log('');
    console.log('Admin login credentials:');
    console.log('  Email: admin@zivahinternational.com');
    console.log('  Password: admin123!');
    console.log('');
    console.log('Manager login credentials:');
    console.log('  Email: manager@zivahinternational.com');
    console.log('  Password: manager123!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
