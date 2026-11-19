import express from 'express';
import "dotenv/config";
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cardRoute from './routes/cardRoute.js'
import orderRoute from './routes/orderRoute.js'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
    origin: "https://e-commerce-akf5.vercel.app",
    credentials: true
}));

app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/card", cardRoute)
app.use("/api/orders", orderRoute)

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is listen at port ${PORT}`);
})
