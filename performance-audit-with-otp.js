/**
 * JustReel Authenticated Performance Audit Script (with OTP)
 *
 * Tests authenticated user flows with automated OTP entry
 *
 * Usage: node performance-audit-with-otp.js <email> <otp>
 * Example: node performance-audit-with-otp.js user@example.com 123456
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3030';
const RESULTS_DIR = './performance-results';

// Get email and OTP from command line
const email = process.argv[2];
const otp = process.argv[3];

if (!email || !otp) {
  console.error('Usage: node performance-audit-with-otp.js <email> <otp>');
  console.error('Example: node performance-audit-with-otp.js user@example.com 123456');
  process.exit(1);
}

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

class AuthenticatedPerformanceAuditor {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = [];
    this.username = null;
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false,
      slowMo: 100
    });
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
      if (url.includes('/api/') || url.includes('supabase')) {
        this.apiCalls.push({
          url,
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });

    this.page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/') && !url.includes('sentry')) {
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

  async login(email, otp) {
    console.log('\n🔐 Authenticating user...');
    console.log('═'.repeat(60));

    // Step 1: Go to auth portal
    console.log('📱 Navigating to auth portal...');
    await this.page.goto(`${BASE_URL}/auth/portal`, { timeout: 60000 });
    await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 30000 });

    // Step 2: Fill in email
    console.log(`📧 Entering email: ${email}`);
    await this.page.fill('input[type="email"], input[name="email"]', email);

    // Step 3: Submit email form
    console.log('📤 Submitting email...');
    await this.page.click('button[type="submit"]');

    // Step 4: Wait for OTP input page to load
    console.log('⏳ Waiting for OTP input page...');
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });

    // Step 5: Wait for OTP input field and enter the code
    console.log(`🔢 Entering OTP code: ${otp}`);

    // Try different possible selectors for the OTP input
    const otpSelectors = [
      'input[name="otp"]',
      'input[type="text"][placeholder*="code" i]',
      'input[type="text"][placeholder*="otp" i]',
      'input[inputmode="numeric"]',
      'input[type="number"]'
    ];

    let otpSelector = null;
    for (const selector of otpSelectors) {
      const element = await this.page.$(selector);
      if (element) {
        console.log(`  ✓ Found OTP input with selector: ${selector}`);
        otpSelector = selector;
        break;
      }
    }

    if (!otpSelector) {
      // Fallback: find any text input on the page
      console.log('  ⚠️  Using fallback: finding any text input...');
      otpSelector = 'input[type="text"]';
    }

    if (!otpSelector) {
      throw new Error('Could not find OTP input field');
    }

    await this.page.fill(otpSelector, otp);

    // Step 6: Submit OTP form
    console.log('✉️  Submitting OTP...');
    const submitButton = await this.page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
    } else {
      // Try pressing Enter
      await this.page.keyboard.press('Enter');
    }

    // Step 7: Wait for authentication to complete
    console.log('⏳ Waiting for authentication to complete...');
    await this.page.waitForFunction(
      () => !window.location.pathname.includes('/auth/'),
      { timeout: 60000 }
    );

    console.log('✅ Successfully authenticated!');

    // Wait a bit for any final redirects
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Extract username from URL
    try {
      const url = this.page.url();
      console.log(`📍 Current URL: ${url}`);
      const match = url.match(/\/([^\/]+)\/(reel-deck|collections|notifications)/);
      if (match) {
        this.username = match[1];
        console.log(`👤 Logged in as: ${this.username}`);
      }
    } catch (e) {
      console.log('   (Username will be determined later)');
    }
  }

  async getUsername() {
    if (this.username) return this.username;

    try {
      await this.page.goto(`${BASE_URL}/me`);
      await this.page.waitForLoadState('networkidle');
      const url = this.page.url();
      const match = url.match(/\/([^\/]+)/);
      if (match) {
        this.username = match[1];
      }
    } catch (e) {
      console.warn('Could not determine username, using placeholder');
      this.username = 'me';
    }

    return this.username;
  }

  // ============ REEL DECK TESTS ============

  async testReelDeckDashboard() {
    const username = await this.getUsername();
    return await this.measureFlow('Reel Deck Dashboard', async (page) => {
      await page.goto(`${BASE_URL}/${username}/reel-deck`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testReelDeckNextUp() {
    const username = await this.getUsername();
    return await this.measureFlow('Reel Deck Next Up', async (page) => {
      await page.goto(`${BASE_URL}/${username}/reel-deck/next-up`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testReelDeckUpcoming() {
    const username = await this.getUsername();
    return await this.measureFlow('Reel Deck Upcoming', async (page) => {
      await page.goto(`${BASE_URL}/${username}/reel-deck/upcoming`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testReelDeckCompleted() {
    const username = await this.getUsername();
    return await this.measureFlow('Reel Deck Completed', async (page) => {
      await page.goto(`${BASE_URL}/${username}/reel-deck/completed`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  // ============ COLLECTIONS TESTS ============

  async testUserCollections() {
    const username = await this.getUsername();
    return await this.measureFlow('User Collections Page', async (page) => {
      await page.goto(`${BASE_URL}/${username}/collections`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  // ============ USER PROFILE TESTS ============

  async testUserProfile() {
    const username = await this.getUsername();
    return await this.measureFlow('User Profile Page', async (page) => {
      await page.goto(`${BASE_URL}/${username}`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testSettingsPage() {
    return await this.measureFlow('Settings Page', async (page) => {
      await page.goto(`${BASE_URL}/settings`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testNotificationsPage() {
    const username = await this.getUsername();
    return await this.measureFlow('Notifications Page', async (page) => {
      await page.goto(`${BASE_URL}/${username}/notifications`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  generateReport() {
    console.log('\n\n');
    console.log('═'.repeat(80));
    console.log('📊 AUTHENTICATED PERFORMANCE AUDIT SUMMARY');
    console.log('═'.repeat(80));

    const sortedResults = [...this.results].sort((a, b) => b.totalTime - a.totalTime);

    console.log('\n🐌 SLOWEST AUTHENTICATED FLOWS:');
    console.log('─'.repeat(80));

    sortedResults.forEach((result, index) => {
      const rank = index + 1;
      console.log(`\n${rank}. ${result.flowName}`);
      console.log(`   ⏱️  Total: ${result.totalTime}ms`);
      console.log(`   📡 APIs: ${result.apiCallCount || 0}`);
      console.log(`   ⚙️  Server: ${result.serverResponseTime || 0}ms`);
      console.log(`   🎨 Render: ${result.renderTime || 0}ms`);
      console.log(`   📦 Transfer: ${result.transferSize || 0}KB`);
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
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

    // Save detailed results to JSON
    const reportPath = path.join(RESULTS_DIR, `audit-authenticated-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      username: this.username,
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
    console.log('\n⏸️  Keeping browser open for manual inspection...');
    console.log('   Press Ctrl+C to close when done.');
    // Don't close browser - keep it open
    // if (this.browser) {
    //   await this.browser.close();
    // }
  }

  async runFullAudit() {
    try {
      await this.init();

      console.log('🚀 Starting JustReel Authenticated Performance Audit...');
      console.log(`📍 Testing URL: ${BASE_URL}`);
      console.log('');

      // Authenticate with provided OTP
      await this.login(email, otp);

      // Run all authenticated tests
      console.log('\n📊 Testing Reel Deck Performance...');
      await this.testReelDeckDashboard();
      await this.testReelDeckNextUp();
      await this.testReelDeckUpcoming();
      await this.testReelDeckCompleted();

      console.log('\n📚 Testing Collections Performance...');
      await this.testUserCollections();

      console.log('\n👤 Testing User Profile Performance...');
      await this.testUserProfile();
      await this.testSettingsPage();
      await this.testNotificationsPage();

      // Generate final report
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
  const auditor = new AuthenticatedPerformanceAuditor();
  await auditor.runFullAudit();
})();
