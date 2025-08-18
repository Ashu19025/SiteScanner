import express from "express";
import { analyzeWebsite, getWebsites, UpdateWebsite, deleteWebsite } from '../controllers/webController.js';

const router = express.Router();

router.post("/",analyzeWebsite);

router.get("/",getWebsites);

router.put("/:id",UpdateWebsite);

router.delete("/:id",deleteWebsite);



export default router;