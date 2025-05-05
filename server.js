const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const dotEnv = require('dotenv');
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")



const app = express();
const PORT = 5000;

// Middleware
// CORS Configuration to allow multiple origins
app.use(cors({
    origin: ['http://localhost:5173', 'https://luna-ecom1.onrender.com'],  // Multiple allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true  // Allow cookies if needed
}));
app.use(bodyParser.json());

dotEnv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch(err => {
        console.log(err)
    });

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);






app.use(express.json());



// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
