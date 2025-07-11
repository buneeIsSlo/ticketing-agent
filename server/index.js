import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { blue, green, redBright } from "yoctocolors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";

import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/ticket", ticketRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(green("MongoDB connected"));
    app.listen(PORT, () =>
      console.log(`🚀 Server running at ${blue("http://localhost:3000")}`)
    );
  })
  .catch((err) => console.error(redBright("MongoDB error: "), err));

app.get("/", (req, res) => {
  res.send("Server up lfg ✅");
});
