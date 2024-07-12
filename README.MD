# Puppeteer Web Crawler with Anti-Bot Detection

This project uses Puppeteer to implement a web crawler that navigates websites while attempting to bypass bot detection mechanisms through human-like behavior and saves the visited URLs along with their depths to a CSV file.

## Features

- Crawls websites using Puppeteer with a BFS algorithm
- Mimics human behavior with realistic mouse movements and random delays
- Sets common user agent and viewport to reduce bot detection
- Exports crawled URLs and their depths to a CSV file

## Installation

1. Clone the repository
   git clone https://github.com/yourusername/puppeteer-web-crawler.git
   cd puppeteer-web-crawler
2. Install the necessary dependencies:
   npm install puppeteer

   To run the web crawler, execute the following command:
   node crawler.js

## Configuration

The main configuration options can be found and modified in the crawler.js file:

- startUrl: The URL from which the crawler will start.
- maxDepth: The maximum depth to which the crawler will follow links.
- maxPages: The maximum number of pages the crawler will visit.
  Example configuration:

`const startUrl = "https://www.browserscan.net";`
const maxDepth = 3;
const maxPages = 50;

## Output

The crawler will generate a CSV file named visited_urls.csv in the project directory. The CSV file will contain the URLs and their respective depths.

Example output (visited_urls.csv):

URL,Depth
`https://www.browserscan.net,0`\
`https://www.browserscan.net/page1,1`\
`https://www.browserscan.net/page2,1`

## Script Overview

````
```

import puppeteer from "puppeteer";
import fs from "fs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => Math.floor(Math.random() * 3000) + 1000;

(async () => {
  // Initialize Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  const page = await browser.newPage();

  // Set user agent and viewport
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
  await page.setViewport({ width: 1280, height: 800 });

  // Function to simulate human-like mouse movements
  async function humanLikeMouseMove(page) {
    await page.mouse.move(0, 0);
    await page.mouse.move(100, 100, { steps: 10 });
    await page.mouse.move(200, 200, { steps: 10 });
  }

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

    await humanLikeMouseMove(page);

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
      await sleep(randomDelay()); // Random delay to mimic human behavior
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

  // Pause execution for some milliseconds
  await sleep(999999);
  // Close the browser
  await browser.close();
})();

```
````
