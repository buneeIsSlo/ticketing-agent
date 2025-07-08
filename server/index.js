import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { blue, green, redBright } from "yoctocolors";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(green("MongoDB connected"));
    app.listen(PORT, () =>
      console.log(`🚀 Server running at ${blue("http://localhost:3000")}`)
    );
  })
  .catch((err) => console.error(redBright("MongoDB error: "), err));
