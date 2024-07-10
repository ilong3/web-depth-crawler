# Puppeteer Web Crawler

    This project uses Puppeteer to create a web crawler that starts from a given URL, explores links up to a specified depth, and saves the visited URLs along with their depths to a CSV file.

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
`https://www.browserscan.net/page2,1`\
