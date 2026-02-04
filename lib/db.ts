import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sahlahmed:JRprN7oZhyEz4s8N@baneandnorrin.ayowrds.mongodb.net/?retryWrites=true&w=majority&appName=BaneAndNorrin";

// We create a global variable to cache the connection so it stays alive
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'bane_and_norrin_db',
      bufferCommands: false, // Prevents hanging if connection fails
    }).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
};