import "dotenv/config"
// import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"

export const client = neon(process.env.Database_URL!)

 
const db = drizzle(client, { schema, logger: false})

export default db