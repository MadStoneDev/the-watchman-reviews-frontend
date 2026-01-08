/**
 * JustReel Extended Performance Audit Script
 *
 * Tests additional flows:
 * - Individual movie pages
 * - Individual series pages
 * - Search functionality
 * - Episode viewing
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3030';
const RESULTS_DIR = './performance-results';

// Sample TMDB IDs for testing
const SAMPLE_MOVIE_ID = '27205'; // Inception
const SAMPLE_SERIES_ID = '1399'; // Game of Thrones

class ExtendedPerformanceAuditor {
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

    // Track network requests
    this.setupRequestTracking();
  }

  setupRequestTracking() {
    this.apiCalls = [];
    this.page.on('request', request => {
      const url = request.url();
      // Track both internal API calls and external ones
      if (url.includes('/api/') || url.includes('supabase')) {
        this.apiCalls.push({
          url,
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });

    // Track response times
    this.responseTimes = new Map();
    this.page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/') || url.includes('supabase')) {
        const request = response.request();
        console.log(`  📡 ${request.method()} ${url.replace(BASE_URL, '').substring(0, 80)}`);
      }
    });
  }

  async measureFlow(flowName, testFn, options = {}) {
    console.log(`\n🔍 Testing: ${flowName}`);
    console.log('═'.repeat(60));

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
      const startTime = Date.now();

      await this.page.evaluate(() => {
        performance.clearMarks();
        performance.clearMeasures();
        performance.mark('flow-start');
      });

      await testFn(this.page);

      await this.page.waitForLoadState('networkidle', { timeout: 30000 });

      if (options.additionalWait) {
        await this.page.waitForTimeout(options.additionalWait);
      }

      const endTime = Date.now();
      metrics.totalTime = endTime - startTime;

      const perfData = await this.page.evaluate(() => {
        performance.mark('flow-end');

        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');

        return {
          navigation: navigation ? {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            domInteractive: navigation.domInteractive,
            responseTime: navigation.responseEnd - navigation.requestStart,
            renderTime: navigation.domComplete - navigation.responseEnd
          } : null,
          resourceCount: resources.length,
          transferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
        };
      });

      metrics.apiCalls = this.apiCalls.map(call => ({
        url: call.url.replace(BASE_URL, '').substring(0, 100),
        method: call.method
      }));

      metrics.apiCallCount = metrics.apiCalls.length;
      metrics.resourceCount = perfData.resourceCount;
      metrics.transferSize = Math.round(perfData.transferSize / 1024);

      if (perfData.navigation) {
        metrics.serverResponseTime = Math.round(perfData.navigation.responseTime);
        metrics.renderTime = Math.round(perfData.navigation.renderTime);
        metrics.domInteractive = Math.round(perfData.navigation.domInteractive);
      }

      console.log(`✅ Total Time: ${metrics.totalTime}ms`);
      console.log(`📡 API Calls: ${metrics.apiCallCount}`);
      console.log(`⚙️  Server Response: ${metrics.serverResponseTime}ms`);
      console.log(`🎨 Render Time: ${metrics.renderTime}ms`);
      console.log(`📦 Resources: ${metrics.resourceCount} (${metrics.transferSize}KB)`);

      this.results.push(metrics);
      return metrics;

    } catch (error) {
      console.error(`❌ Error testing ${flowName}:`, error.message);
      metrics.error = error.message;
      this.results.push(metrics);
      return metrics;
    }
  }

  async testMovieDetailPage() {
    return await this.measureFlow('Movie Detail Page', async (page) => {
      await page.goto(`${BASE_URL}/movies/${SAMPLE_MOVIE_ID}`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testSeriesDetailPage() {
    return await this.measureFlow('Series Detail Page', async (page) => {
      await page.goto(`${BASE_URL}/series/${SAMPLE_SERIES_ID}`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testSearchPage() {
    return await this.measureFlow('Search Page Load', async (page) => {
      await page.goto(`${BASE_URL}/search`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testSearchWithQuery() {
    return await this.measureFlow('Search with Query', async (page) => {
      await page.goto(`${BASE_URL}/search?q=inception`);
      await page.waitForSelector('main', { timeout: 10000 });
      await page.waitForTimeout(2000); // Wait for search results
    }, { additionalWait: 1000 });
  }

  async testBrowsePage() {
    return await this.measureFlow('Browse Landing Page', async (page) => {
      await page.goto(`${BASE_URL}/browse`);
      await page.waitForSelector('main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testBrowseKids() {
    return await this.measureFlow('Browse Kids Page', async (page) => {
      await page.goto(`${BASE_URL}/browse/kids`);
      await page.waitForSelector('main', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testHowItWorks() {
    return await this.measureFlow('How It Works Page', async (page) => {
      await page.goto(`${BASE_URL}/how-it-works`);
      await page.waitForSelector('main', { timeout: 10000 });
    });
  }

  generateReport() {
    console.log('\n\n');
    console.log('═'.repeat(80));
    console.log('📊 EXTENDED PERFORMANCE AUDIT SUMMARY');
    console.log('═'.repeat(80));

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

    const avgTotalTime = this.results.reduce((sum, r) => sum + r.totalTime, 0) / this.results.length;
    const avgApiCalls = this.results.reduce((sum, r) => sum + (r.apiCallCount || 0), 0) / this.results.length;

    console.log('\n\n💡 PERFORMANCE INSIGHTS:');
    console.log('─'.repeat(80));
    console.log(`Average Load Time: ${Math.round(avgTotalTime)}ms`);
    console.log(`Average API Calls: ${Math.round(avgApiCalls)}`);

    const slowFlows = sortedResults.filter(r => r.totalTime > avgTotalTime * 1.5);
    if (slowFlows.length > 0) {
      console.log(`\n⚠️  ${slowFlows.length} flow(s) significantly slower than average:`);
      slowFlows.forEach(f => {
        console.log(`   - ${f.flowName} (${f.totalTime}ms)`);
      });
    }

    const reportPath = path.join(RESULTS_DIR, `audit-extended-${Date.now()}.json`);
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

      console.log('🚀 Starting JustReel Extended Performance Audit...');
      console.log(`📍 Testing URL: ${BASE_URL}`);
      console.log('');

      // Run all tests
      await this.testBrowsePage();
      await this.testBrowseKids();
      await this.testMovieDetailPage();
      await this.testSeriesDetailPage();
      await this.testSearchPage();
      await this.testSearchWithQuery();
      await this.testHowItWorks();

      this.generateReport();

    } catch (error) {
      console.error('Fatal error during audit:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Main execution
(async () => {
  const auditor = new ExtendedPerformanceAuditor();
  await auditor.runFullAudit();
})();
