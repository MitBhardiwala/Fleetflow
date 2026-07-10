import express, { Request, Response } from "express";
import { prisma } from "./db";
import v1Routes from "./routes/index";
import { STATUS_CODES } from "./utils/constants";
import { errorHandler } from "./utils/error";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/status", (_req: Request, res: Response) => {
  res.status(STATUS_CODES.OK).json({
    message: "Server is running properly",
  });
});


app.use("/api/v1", v1Routes);

app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  }
}

startServer();
