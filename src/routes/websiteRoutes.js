import express from "express";
import { analyzeWebsite, getWebsites, updateWebsite, deleteWebsite } from '../controllers/webController.js';

const router = express.Router();

router.post("/",analyzeWebsite);

router.get("/",getWebsites);

router.put("/:id",updateWebsite);

router.delete("/:id",deleteWebsite);



export default router;
