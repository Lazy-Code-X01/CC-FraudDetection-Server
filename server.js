import path from "path";
import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/userMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import cors from 'cors'
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors())

app.use("/api/users", userRoutes);

// if (process.env.NODE_ENV === 'production') {
//     const _dirname = path.resolve()
//     app.use(express.static(path.join(__dirname, 'frontend/dist')))
//     app.get('*', (req, res)=> res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')))
// }else{
//     app.get("/", (req, res)=> res.send("Server is ready"))
// }

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
