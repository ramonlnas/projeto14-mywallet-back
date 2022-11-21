import express from "express";
import cors from "cors";
import joi from "joi";


import vallueRouters from "../src/routes/vallueRoutes.js"
import userRouters from "../src/routes/usersRoutes.js"
const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouters)
app.use(vallueRouters)





app.listen(5000, () => console.log("Server running in port 5000"));
