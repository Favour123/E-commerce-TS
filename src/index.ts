import express,{Express} from 'express';
import  connectDB  from '@database/db';
import dotenv from 'dotenv';
import { logger} from '@middleware/logger';
import userRoutes from '@routes/auth.routes';
import productRoutes from '@routes/product.routes';
import cartRoutes from '@routes/cart.routes';
dotenv.config();  
const app: Express = express();

//mongoose connection
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger);


//All ROUTES
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product", productRoutes);



const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
console.log("you are welcome to my backend server");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});