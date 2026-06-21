import mongoose from "mongoose";
import { env } from "./env";

const MONGODB_URI = env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  supportsTransactions?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, supportsTransactions: false };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
      try {
        const db = mongooseInstance.connection.db;
        if (db) {
          const hello = await db.command({ hello: 1 });
          cached!.supportsTransactions = !!hello.setName;
        } else {
          cached!.supportsTransactions = false;
        }
      } catch (e) {
        cached!.supportsTransactions = false;
      }
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export function dbSupportsTransactions(): boolean {
  return !!cached?.supportsTransactions;
}
