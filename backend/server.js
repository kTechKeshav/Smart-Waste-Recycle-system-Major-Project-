import express from "express";
import cors from "cors"
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import recycleRouter from "./routes/recycleRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection.
// connectDB();

app.use(express.json());
app.use(cors())

app.use('/api/recycle', recycleRouter);

app.get('/', (req, res)=>{
      res.send("API Working");
})


app.listen(PORT, ()=>{
      console.log(`Server started on port http://localhost:${PORT}`);
})