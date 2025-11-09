import { MongoClient } from 'mongodb';

// Test MongoDB connection with SSL certificate allowances
async function testConnection() {
  const uri = 'mongodb+srv://adisinrt24_db_user:1234567890@cluster0.imokdvf.mongodb.net/';
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Allow invalid certificates
    tlsAllowInvalidHostnames: true, // Allow invalid hostnames
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // 45 second socket timeout
    maxPoolSize: 10, // Connection pool size
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    // Test database access
    const db = client.db('dsa-habit-forge');
    console.log('✅ Database access confirmed');

    // Test a simple operation
    const collections = await db.collections();
    console.log(`✅ Found ${collections.length} collections in the database`);

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();
