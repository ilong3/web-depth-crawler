import puppeteer from "puppeteer";
import fs from "fs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  // Initialize Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // URL to start with
  const startUrl = "https://www.browserscan.net";
  const maxDepth = 3;
  const maxPages = 50;
  // Queue for BFS (contains objects with url and depth)
  const queue = [{ url: startUrl, depth: 0 }];

  // Set to keep track of visited URLs
  const visited = new Set();

  // Map to keep track of URL depths
  const depthMap = new Map();
  depthMap.set(startUrl, 0);

  // Function to extract links from a page
  async function extractLinks(url) {
    await page.goto(url);
    await page.waitForSelector("body");
    // Another alternative to extract links
    // const links = await page.$$eval("a[href]", (el) =>
    //             el.map((link) => new URL(link.href, window.location.href).toString())
    //       );

    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll("a[href]");
      return Array.from(linkElements).map((link) => link.href);
    });
    return links;
  }

  // BFS loop
  while (queue.length > 0 && visited.size < maxPages) {
    const { url: currentUrl, depth } = queue.shift();
    if (visited.has(currentUrl) || depth > maxDepth) {
      continue;
    }

    try {
      visited.add(currentUrl);
      console.log(`Visiting: ${currentUrl} at depth ${depth}`);
      const links = await extractLinks(currentUrl);

      for (const link of links) {
        let absoluteLink = link;
        if (link.startsWith("/")) {
          absoluteLink = new URL(link, startUrl).toString();
        }

        if (
          !visited.has(absoluteLink) &&
          !queue.some((item) => item.url === absoluteLink)
        ) {
          queue.push({ url: absoluteLink, depth: depth + 1 });
          depthMap.set(absoluteLink, depth + 1);
        }
      }
    } catch (error) {
      console.error(`Error visiting ${currentUrl}:`, error);
    }
  }

  // Output visited URLs
  console.log("Visited URLs:", Array.from(visited));

  // Prepare data for CSV
  const csvData = Array.from(depthMap)
    .map(([url, depth]) => `${url},${depth}`)
    .join("\n");

  // Write data to CSV file
  fs.writeFileSync("visited_urls.csv", "URL,Depth\n" + csvData);

  //   pause execution for a some milliseconds
  await sleep(999999);
  // Close the browser
  await browser.close();
})();
