import { MongoClient } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI;

// Create a MongoDB client instance
const client = new MongoClient(MONGODB_URI);

// Export the client for use in other parts of the application
export { client };

// Optional: Export a function to connect to the database
export const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db(); // Return the default database
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Optional: Export a function to close the connection
export const closeMongoDBConnection = async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
