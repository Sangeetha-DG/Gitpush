
import express from "express";
import cors from "cors";
import { initPlaywright, getLivePrice } from "./playwright";
import { WebSocketServer } from "ws";


const app = express();
app.use(cors());
app.use(express.json());


const PORT = 4000;


// HTTP endpoint for quick price fetch
app.get("/price/:ticker", async (req, res) => {
 const ticker = req.params.ticker;
 try {
   await initPlaywright(ticker);
   const price = await getLivePrice();
   res.json({ ticker, price });
 } catch (err) {
   res.status(500).json({ error: "Failed to fetch price" });
 }
});


// WebSocket for live streaming
const wss = new WebSocketServer({ port: 4001 });
wss.on("connection", async (ws, req) => {
 const url = new URL(req.url!, `http://${req.headers.host}`);
 const ticker = url.searchParams.get("ticker") || "BTCUSD";


 await initPlaywright(ticker);


 const interval = setInterval(async () => {
   try {
     const price = await getLivePrice();
     ws.send(JSON.stringify({ ticker, price }));
   } catch (err) {
     ws.send(JSON.stringify({ error: "Failed to get price" }));
   }
 }, 180000); // update every 2 seconds


 ws.on("close", () => clearInterval(interval));
});


app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
console.log("WebSocket running at ws://localhost:4001");


