import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { blue, green, redBright } from "yoctocolors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/ticket", ticketRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignUp, onTicketCreated],
  })
);

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
