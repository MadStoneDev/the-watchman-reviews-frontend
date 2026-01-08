/**
 * JustReel Performance Audit Script
 *
 * Measures performance metrics for major user flows:
 * - Total load time
 * - Number of API calls
 * - Server response time
 * - Render time
 *
 * Run with: node performance-audit.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3030';
const RESULTS_DIR = './performance-results';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

class PerformanceAuditor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    this.page = await this.context.newPage();

    // Enable request interception to track API calls
    this.setupRequestTracking();
  }

  setupRequestTracking() {
    this.apiCalls = [];
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/')) {
        this.apiCalls.push({
          url,
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });
  }

  async measureFlow(flowName, testFn, options = {}) {
    console.log(`\n🔍 Testing: ${flowName}`);
    console.log('═'.repeat(60));

    // Reset tracking
    this.apiCalls = [];
    const metrics = {
      flowName,
      apiCalls: [],
      totalTime: 0,
      serverResponseTime: 0,
      renderTime: 0,
      resourceCount: 0,
      transferSize: 0,
      timestamp: new Date().toISOString()
    };

    try {
      // Start performance measurement
      const startTime = Date.now();

      // Clear performance entries
      await this.page.evaluate(() => {
        performance.clearMarks();
        performance.clearMeasures();
        performance.mark('flow-start');
      });

      // Run the test flow
      await testFn(this.page);

      // Wait for network idle (no requests for 500ms)
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });

      // Additional wait if specified
      if (options.additionalWait) {
        await this.page.waitForTimeout(options.additionalWait);
      }

      const endTime = Date.now();
      metrics.totalTime = endTime - startTime;

      // Collect performance metrics
      const perfData = await this.page.evaluate(() => {
        performance.mark('flow-end');

        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        const paint = performance.getEntriesByType('paint');

        return {
          navigation: navigation ? {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            domInteractive: navigation.domInteractive,
            responseTime: navigation.responseEnd - navigation.requestStart,
            renderTime: navigation.domComplete - navigation.responseEnd
          } : null,
          resourceCount: resources.length,
          transferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
          paint: paint.map(p => ({ name: p.name, time: p.startTime }))
        };
      });

      // Process API calls
      metrics.apiCalls = this.apiCalls.map(call => ({
        url: call.url.replace(BASE_URL, ''),
        method: call.method
      }));

      metrics.apiCallCount = metrics.apiCalls.length;
      metrics.resourceCount = perfData.resourceCount;
      metrics.transferSize = Math.round(perfData.transferSize / 1024); // KB

      if (perfData.navigation) {
        metrics.serverResponseTime = Math.round(perfData.navigation.responseTime);
        metrics.renderTime = Math.round(perfData.navigation.renderTime);
        metrics.domInteractive = Math.round(perfData.navigation.domInteractive);
      }

      // Print results
      console.log(`✅ Total Time: ${metrics.totalTime}ms`);
      console.log(`📡 API Calls: ${metrics.apiCallCount}`);
      console.log(`⚙️  Server Response: ${metrics.serverResponseTime}ms`);
      console.log(`🎨 Render Time: ${metrics.renderTime}ms`);
      console.log(`📦 Resources: ${metrics.resourceCount} (${metrics.transferSize}KB)`);

      if (metrics.apiCalls.length > 0) {
        console.log(`\n📋 API Endpoints Called:`);
        metrics.apiCalls.forEach((call, i) => {
          console.log(`   ${i + 1}. ${call.method} ${call.url}`);
        });
      }

      this.results.push(metrics);
      return metrics;

    } catch (error) {
      console.error(`❌ Error testing ${flowName}:`, error.message);
      metrics.error = error.message;
      this.results.push(metrics);
      return metrics;
    }
  }

  async testHomepageNavigation() {
    return await this.measureFlow('Homepage Load', async (page) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('main', { timeout: 10000 });
    });
  }

  async testBrowseMovies() {
    return await this.measureFlow('Browse Movies Page', async (page) => {
      await page.goto(`${BASE_URL}/browse/movies`);
      await page.waitForSelector('[data-testid="media-grid"], main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testBrowseSeries() {
    return await this.measureFlow('Browse Series Page', async (page) => {
      await page.goto(`${BASE_URL}/browse/series`);
      await page.waitForSelector('[data-testid="media-grid"], main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testSearchFunctionality() {
    return await this.measureFlow('Search Functionality', async (page) => {
      await page.goto(BASE_URL);
      await page.waitForSelector('input[type="search"], input[placeholder*="Search"], input[name="search"]', { timeout: 5000 });

      // Type search query
      await page.fill('input[type="search"], input[placeholder*="Search"], input[name="search"]', 'Inception');
      await page.keyboard.press('Enter');

      // Wait for results
      await page.waitForTimeout(2000);
    });
  }

  async testCollectionView() {
    return await this.measureFlow('Public Collection View', async (page) => {
      // Navigate to collections page or a specific collection
      await page.goto(`${BASE_URL}/collections`);
      await page.waitForSelector('main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testPageNavigation() {
    return await this.measureFlow('Navigation Between Pages', async (page) => {
      // Start at homepage
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Navigate to browse
      const browseLink = await page.$('a[href*="/browse"]');
      if (browseLink) {
        await browseLink.click();
        await page.waitForLoadState('networkidle');
      }
    });
  }

  async testBrowseNew() {
    return await this.measureFlow('Browse New Releases', async (page) => {
      await page.goto(`${BASE_URL}/browse/new`);
      await page.waitForSelector('main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testAboutPage() {
    return await this.measureFlow('About Page Load', async (page) => {
      await page.goto(`${BASE_URL}/about`);
      await page.waitForSelector('main', { timeout: 10000 });
    });
  }

  generateReport() {
    console.log('\n\n');
    console.log('═'.repeat(80));
    console.log('📊 PERFORMANCE AUDIT SUMMARY');
    console.log('═'.repeat(80));

    // Sort by total time descending
    const sortedResults = [...this.results].sort((a, b) => b.totalTime - a.totalTime);

    console.log('\n🐌 SLOWEST FLOWS (Prioritized):');
    console.log('─'.repeat(80));

    sortedResults.forEach((result, index) => {
      const rank = index + 1;
      console.log(`\n${rank}. ${result.flowName}`);
      console.log(`   ⏱️  Total: ${result.totalTime}ms`);
      console.log(`   📡 APIs: ${result.apiCallCount || 0}`);
      console.log(`   ⚙️  Server: ${result.serverResponseTime || 0}ms`);
      console.log(`   🎨 Render: ${result.renderTime || 0}ms`);
      console.log(`   📦 Transfer: ${result.transferSize || 0}KB`);
    });

    // Performance insights
    console.log('\n\n💡 PERFORMANCE INSIGHTS:');
    console.log('─'.repeat(80));

    const avgTotalTime = this.results.reduce((sum, r) => sum + r.totalTime, 0) / this.results.length;
    const avgApiCalls = this.results.reduce((sum, r) => sum + (r.apiCallCount || 0), 0) / this.results.length;

    console.log(`Average Load Time: ${Math.round(avgTotalTime)}ms`);
    console.log(`Average API Calls: ${Math.round(avgApiCalls)}`);

    const slowFlows = sortedResults.filter(r => r.totalTime > avgTotalTime * 1.5);
    if (slowFlows.length > 0) {
      console.log(`\n⚠️  ${slowFlows.length} flow(s) significantly slower than average:`);
      slowFlows.forEach(f => {
        console.log(`   - ${f.flowName} (${f.totalTime}ms)`);
      });
    }

    // Save detailed results to JSON
    const reportPath = path.join(RESULTS_DIR, `audit-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalFlowsTested: this.results.length,
        averageTotalTime: Math.round(avgTotalTime),
        averageApiCalls: Math.round(avgApiCalls)
      },
      results: sortedResults
    }, null, 2));

    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    console.log('═'.repeat(80));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullAudit() {
    try {
      await this.init();

      console.log('🚀 Starting JustReel Performance Audit...');
      console.log(`📍 Testing URL: ${BASE_URL}`);
      console.log('');

      // Run all tests
      await this.testHomepageNavigation();
      await this.testBrowseMovies();
      await this.testBrowseSeries();
      await this.testBrowseNew();
      await this.testSearchFunctionality();
      await this.testCollectionView();
      await this.testPageNavigation();
      await this.testAboutPage();

      // Generate final report
      this.generateReport();

    } catch (error) {
      console.error('Fatal error during audit:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Check if Playwright is available
async function checkDependencies() {
  try {
    require.resolve('playwright');
    return true;
  } catch (e) {
    console.error('❌ Playwright is not installed.');
    console.error('📦 Install it with: npm install -D playwright');
    console.error('   or: npx playwright install');
    return false;
  }
}

// Main execution
(async () => {
  if (!await checkDependencies()) {
    process.exit(1);
  }

  const auditor = new PerformanceAuditor();
  await auditor.runFullAudit();
})();
