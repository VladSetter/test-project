import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiProxyRouter from "./ai-proxy";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "server" });
});

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/private/ai-proxy", aiProxyRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
