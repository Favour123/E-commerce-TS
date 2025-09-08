import express,{Application} from 'express';
import  connectDB  from '@database/db';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import { logger} from '@middleware/logger';
import userRoutes from '@routes/auth.routes';
import productRoutes from '@routes/product.routes';
import cartRoutes from '@routes/cart.routes';
  
const app: Application = express();

//mongoose connection
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(logger);


//All ROUTES
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product", productRoutes);



const PORT = process.env.PORT || 3000;

console.log("you are welcome to my backend server");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});