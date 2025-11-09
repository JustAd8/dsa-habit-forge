import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://adisinrt24_db_user:1234567890@cluster0.imokdvf.mongodb.net/';

if (!MONGODB_URI) {
  console.warn('VITE_MONGODB_URI is not set. MongoDB functionality will not work.');
}

class MongoDBClient {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    try {
      // Configure MongoDB client with SSL options to handle certificate issues
      this.client = new MongoClient(MONGODB_URI, {
        tls: true,
        tlsAllowInvalidCertificates: true, // Allow invalid certificates for testing
        tlsAllowInvalidHostnames: true, // Allow invalid hostnames for testing
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        socketTimeoutMS: 45000, // 45 second socket timeout
        maxPoolSize: 10, // Connection pool size
      });

      await this.client.connect();
      this.db = this.client.db('dsa-habit-forge'); // Database name
      console.log('Connected to MongoDB successfully');
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getDb(): Db | null {
    return this.db;
  }
}

export const mongoClient = new MongoDBClient();
export default mongoClient;
