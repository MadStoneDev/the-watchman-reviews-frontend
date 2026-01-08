/**
 * JustReel Authenticated Performance Audit Script
 *
 * Tests authenticated user flows:
 * - Reel Deck dashboard and operations
 * - Collections management
 * - User profile pages
 * - Settings and notifications
 *
 * Run with: node performance-audit-authenticated.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BASE_URL = 'http://localhost:3030';
const RESULTS_DIR = './performance-results';

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
      slowMo: 100 // Slow down actions slightly for stability
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
      // Track both internal API calls and external ones
      if (url.includes('/api/') || url.includes('supabase')) {
        this.apiCalls.push({
          url,
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });

    // Track responses for performance data
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

  async login(email) {
    console.log('\n🔐 Authenticating user...');
    console.log('═'.repeat(60));

    // Step 1: Go to auth portal
    await this.page.goto(`${BASE_URL}/auth/portal`);
    await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Step 2: Fill in email
    console.log(`📧 Entering email: ${email}`);
    await this.page.fill('input[type="email"], input[name="email"]', email);

    // Step 3: Submit email form
    console.log('📤 Submitting email...');
    await this.page.click('button[type="submit"]');

    // Step 4: Wait for OTP input page to load
    console.log('⏳ Waiting for OTP input page...');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check if we're on the OTP/check-email page
    const currentUrl = this.page.url();
    if (currentUrl.includes('/check-email') || currentUrl.includes('/auth/')) {
      console.log('✅ Email sent! Check your inbox.');
      console.log('');
      console.log('🔔 WAITING FOR YOU TO ENTER THE MAGIC CODE');
      console.log('   The browser window is open and waiting...');
      console.log('   Enter the code you received via email in the browser.');
      console.log('');

      // Wait for user to manually enter the OTP and complete authentication
      // We'll wait for navigation away from auth pages
      console.log('⏳ Waiting for authentication to complete...');

      // Wait up to 5 minutes for user to enter code
      await this.page.waitForFunction(
        () => !window.location.pathname.includes('/auth/'),
        { timeout: 300000 } // 5 minutes
      );

      console.log('✅ Successfully authenticated!');
    } else if (currentUrl.includes('/auth/portal')) {
      throw new Error('Login failed - still on login page. Check if email is correct.');
    }

    // Wait a bit for any final redirects
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Extract username from URL or profile
    try {
      const url = this.page.url();
      const match = url.match(/\/([^\/]+)\/(reel-deck|collections|notifications)/);
      if (match) {
        this.username = match[1];
        console.log(`👤 Logged in as: ${this.username}`);
      }
    } catch (e) {
      // Will try to get username from profile later
      console.log('   (Username will be determined later)');
    }
  }

  async getUsername() {
    if (this.username) return this.username;

    // Try to get username from profile or URL
    try {
      // Navigate to a user page and extract username
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

  async testToggleEpisode() {
    const username = await this.getUsername();
    return await this.measureFlow('Toggle Episode Watch Status', async (page) => {
      // Go to reel deck and find a series to interact with
      await page.goto(`${BASE_URL}/${username}/reel-deck`);
      await page.waitForSelector('main', { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Try to find and click an episode toggle button
      const toggleButton = await page.$('button[data-testid="episode-toggle"], button:has-text("Episode"), .episode-toggle');
      if (toggleButton) {
        await toggleButton.click();
        await page.waitForTimeout(500); // Wait for API call
      } else {
        console.log('  ⚠️  No episode toggle found (user may have no series in reel deck)');
      }
    });
  }

  // ============ COLLECTIONS TESTS ============

  async testUserCollections() {
    const username = await this.getUsername();
    return await this.measureFlow('User Collections Page', async (page) => {
      await page.goto(`${BASE_URL}/${username}/collections`);
      await page.waitForSelector('main, h1', { timeout: 10000 });
    }, { additionalWait: 1000 });
  }

  async testCreateCollection() {
    return await this.measureFlow('Create New Collection', async (page) => {
      const username = await this.getUsername();
      await page.goto(`${BASE_URL}/${username}/collections`);
      await page.waitForSelector('main', { timeout: 10000 });

      // Try to find "New Collection" or "Create" button
      const createButton = await page.$('button:has-text("Create"), button:has-text("New Collection"), button[data-testid="create-collection"]');
      if (createButton) {
        await createButton.click();
        await page.waitForTimeout(1000);
      } else {
        console.log('  ⚠️  No create collection button found');
      }
    });
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

  // ============ SEARCH & ADD TO REEL DECK ============

  async testSearchAndAddToReelDeck() {
    return await this.measureFlow('Search and Add to Reel Deck', async (page) => {
      await page.goto(`${BASE_URL}/search`);
      await page.waitForSelector('main', { timeout: 10000 });

      // Perform search
      const searchInput = await page.$('input[type="search"], input[placeholder*="Search"]');
      if (searchInput) {
        await searchInput.fill('Breaking Bad');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000); // Wait for results

        // Try to click "Add to Reel Deck" button
        const addButton = await page.$('button:has-text("Add to Reel Deck"), button[data-testid="add-to-reel-deck"]');
        if (addButton) {
          await addButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });
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
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullAudit() {
    try {
      await this.init();

      console.log('🚀 Starting JustReel Authenticated Performance Audit...');
      console.log(`📍 Testing URL: ${BASE_URL}`);
      console.log('');

      // Prompt for email
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const email = await new Promise((resolve) => {
        rl.question('Enter your email: ', resolve);
      });

      rl.close();

      // Authenticate (will wait for magic code)
      await this.login(email);

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

      console.log('\n🔍 Testing Search & Interactions...');
      await this.testSearchAndAddToReelDeck();

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
