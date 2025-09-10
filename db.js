import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// For Supabase pooler URLs include sslmode in the URL. No extra opts needed.
const sql = postgres(connectionString);

export default sql;
