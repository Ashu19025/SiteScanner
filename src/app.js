import express from "express";
import cors from "cors";
import websiteRoutes from "./routes/websiteRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/website",websiteRoutes);

//
app.use((err,req,res,next) => {
    console.error("Uncaught Error",err.message);
    res.status(500).json({error:"Internal Server Error"});
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
});
