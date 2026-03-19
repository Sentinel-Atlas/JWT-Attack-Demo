import "dotenv/config";
import cors from "cors";
import express from "express";
import attackRoutes from "./routes/attack";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use("/api", attackRoutes);

app.listen(port, () => {
  console.log(`jwt-attack-engine listening on http://localhost:${port}`);
});
