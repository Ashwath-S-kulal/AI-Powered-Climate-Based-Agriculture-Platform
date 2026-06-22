import app from "../index.js";
import connectDB from "../config/db.js";


export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

