/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: 'https://tbhfeedback.live', // Replace with your actual site URL
    generateRobotsTxt: true, // Generates a robots.txt file
    sitemapSize: 5000, // Max entries per sitemap
    exclude: ['/admin/*', '/404'], // Exclude specific pages or paths
    changefreq: 'daily', // Frequency of updates for your pages
    priority: 0.7, // Priority for the pages
};

module.exports = sitemapConfig;
