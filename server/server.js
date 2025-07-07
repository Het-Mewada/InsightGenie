import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(
  cors({
    origin:"https://insight-genie.netlify.app", // your React frontend URL
    credentials: true, // if using cookies or auth
  })
);

app.use(express.json({limit:'5mb'}));

app.use("/api/upload", uploadRoutes);
app.use("/api/insights" , insightRoutes);

app.get("/", (req, res) => {
  res.send("InsightGenie Backend Running...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
