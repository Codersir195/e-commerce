import express from 'express';
import dotenv from 'dotenv'
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cardRoute from './routes/cardRoute.js'
import orderRoute from './routes/orderRoute.js'
import cors from 'cors'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors ({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/card", cardRoute)
app.use("/api/orders", orderRoute)


app.listen(PORT, () => {
    connectDB()
    console.log(`Server is listen at port ${PORT}`);
})