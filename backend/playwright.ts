import { chromium, Browser, Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;
let currentTicker: string | null = null;

export async function initPlaywright(ticker: string) {
  browser = await chromium.launch({ headless: false }); // headed mode
  page = await browser.newPage();
  currentTicker = ticker;

  await page.goto(
    `https://www.tradingview.com/symbols/${ticker}/?exchange=BINANCE`,
    { waitUntil: "domcontentloaded" }
  );

  // Wait for the price element to appear
  try {
    // Use a partial class match for dynamic classes
    await page.waitForSelector('div[class*="details-"], div[data-field="last"]', { timeout: 30000 });
    console.log(`✅ TradingView loaded for ${ticker}`);
  } catch {
    
  }
}

export async function getLivePrice(): Promise<{ ticker: string; price: string }> {
  if (!page || !currentTicker) throw new Error("Playwright page not initialized");

  try {
    // Try both: data-field or dynamic class
    const priceSelector = 'div[data-field="last"], div[class*="details-"]';
    const price = await page.$eval(priceSelector, el => el.textContent?.trim() || "Not loading");
    return { ticker: currentTicker, price };
  } catch {
    return { ticker: currentTicker, price: "Not loading" };
  }
}

export async function closePlaywright() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
    currentTicker = null;
  }
}


