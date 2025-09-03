import type { NextApiRequest, NextApiResponse } from "next";
import { initPlaywright, getLivePrice } from "../../../backend/server";

let initialized = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ticker = req.query.ticker?.toString() || "BTCUSD";

    // Initialize Playwright once
    if (!initialized) {
      await initPlaywright(ticker);
      initialized = true;
    }

    const data = await getLivePrice();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ticker: "N/A", price: "Not loading" });
  }
}
