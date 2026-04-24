import express from "express";
import { env } from "./config/env";
import cors from "cors";

const app = express();
app.use(cors());

import processSourceRoute from "./routes/processSource.route";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use("/api", processSourceRoute);

export default app;