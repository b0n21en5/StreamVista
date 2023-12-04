import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./helpers/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

//  api routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/channels", channelRoutes);
app.use("/api/v1/videos", videoRoutes);

connectDB();

app.use(
  express.static(path.join(__dirname, "../frontend/dist"), { maxAge: "7d" })
);

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
