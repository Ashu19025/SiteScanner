import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

export const scrapeWebsite = async (url) => {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false }); // ignore SSL errors

    const { data } = await axios.get(url, { httpsAgent: agent, timeout: 10000 });

    const $ = cheerio.load(data);

    const brand =
      $('meta[property="og:site_name"]').attr("content") ||
      $("title").text().trim() ||
      "Unknown Brand";

    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      "No description available";

    return { brand, description };
  } catch (error) {
    console.error("Scraping error:", error.message);
    // Return fallback instead of throwing
    return { brand: "Unknown Brand", description: "No description available" };
  }
};