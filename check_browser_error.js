const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));
  page.on("console", msg => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });
  await page.goto("http://localhost:3000");
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
