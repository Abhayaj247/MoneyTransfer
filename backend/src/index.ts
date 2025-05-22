import express from "express";
import mainRouter from "./routes/index";
import cors from "cors";

const app = express();
// Middleware
app.use(cors({
  origin: ['https://money-transfer-frontend-three.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api/v1",mainRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});