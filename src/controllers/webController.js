import { scrapeWebsite } from "../services/scraper.js";
import { pool } from "../db.js";
import validator from "validator";

// scrape the web and save into DB
export const analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      return res.status(400).json({ error: "Invalid URL. Include http:// or https://" });
    }

    // Check if URL already exists
    const exists = await pool.query("SELECT * FROM websites WHERE url = $1", [url]);
    if (exists.rows.length > 0) {
      return res.status(200).json({ success: true, data: exists.rows[0] });
    }

    // Scrape website (
    const { brand, description } = await scrapeWebsite(url);
    console.log("📡 Inserting into DB:", url, brand, description);

    // Save in DB
    const result = await pool.query(
      "INSERT INTO websites (url, brand_name, description) VALUES ($1, $2, $3) RETURNING *",
      [url, brand, description]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ DB/Controller Error:", error);
    res.status(500).json({ error: "Failed to analyze website" });
  }
};

//fetch all websites
export const getWebsites = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM websites ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("DB Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch websites" });
  }
};

// update website by id
export const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand_name, description } = req.body;

    const result = await pool.query(
      "UPDATE websites SET brand_name = $1, description = $2 WHERE id = $3 RETURNING *",
      [brand_name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Website not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update website" });
  }
};

//  delete website by id
export const deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM websites WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Website not found" });
    }

    res.json({ success: true, message: "Website deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ error: "Failed to delete website" });
  }
};
