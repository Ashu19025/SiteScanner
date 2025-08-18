import { scrapeWebsite } from "../services/scraper.js";
import { pool } from "../db.js";
import validator from "validator";

// POST /api/website -> scrape + save into DB
export const analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;
    
    // Input validation
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    
    // Ensure URL starts with http or https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ error: "URL must start with http:// or https://" });
    }

    console.log(` Analyzing website: ${url}`);
    const { brand, description } = await scrapeWebsite(url);

    console.log(" Inserting into DB:", url, brand, description);

    const result = await pool.query(
      "INSERT INTO websites (url, brand_name, description) VALUES ($1, $2, $3) RETURNING *",
      [url, brand, description]
    );

    console.log(" Insert result:", result.rows);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(" DB/Controller Error:", error);
    res.status(500).json({ error: "Failed to analyze website" });
  }
};

//  GET /api/website -> fetch all websites
export const getWebsites = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM websites ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("DB Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch websites" });
  }
};

//Update

export const UpdateWebsite = async(req,res) =>{
    try{
        const  {id} = req.params;
        const {brand_name,description} = req.body;

        const result = await pool.query(
            "UPDATE websites SET brand_name = $1, description = $2 WHERE id = $3 RETURNING *",
            [brand_name,description,id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error:"website not found"});
        }
        res.json({success:true,data:result.rows[0] });
    }catch(error){
        console.error("update Error:",error.message);
        res.status(500).json({error:"Failed to update website"});
    }
};

export const deleteWebsite = async (req,res)=> {
    try{
        const{id} = req.params;

        const result = await pool.query("DELETE FROM websites WHERE id = $1 RETURNING *", [id]);
        if(result.rows.length === 0){
            return res.status(404).json({error:"Website not found"});
        }
        res.json({success:true,message:"Website deleted successfully"});
    }catch(error){
        console.error("delete Error:",error.message);
        res.status(500).json({error:"Failed to delete website"});
    }
};

