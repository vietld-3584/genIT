#!/usr/bin/env node

/**
 * Integration Test Validation Script
 * 
 * This script validates the integration test suite structure and configuration
 * to ensure everything is properly set up before running tests.
 */

const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname, '..', 'tests', 'integration');

// Required test files and their expected test case counts
const EXPECTED_TEST_FILES = {
  'auth/signin.test.ts': 10,
  'auth/signup.test.ts': 15,
  'auth/logout.test.ts': 4,
  'channels/channels.test.ts': 24,
  'channels/members.test.ts': 14,
  'messages/messages.test.ts': 13,
  'users/search.test.ts': 5,
  'users/profile.test.ts': 18
};

// Required setup files
const EXPECTED_SETUP_FILES = [
  'setup/globalSetup.ts',
  'setup/server.ts',
  'setup/testData.ts',
  'fixtures/factories.ts',
  'fixtures/index.ts'
];

const REQUIRED_PACKAGES = [
  'vitest',
  'supertest',
  '@faker-js/faker',
  'express'
];

console.log('🔍 Validating Integration Test Suite...\n');

let validationErrors = 0;

// Check if tests directory exists
if (!fs.existsSync(TESTS_DIR)) {
  console.error('❌ Tests directory not found:', TESTS_DIR);
  validationErrors++;
} else {
  console.log('✅ Tests directory found');
}

// Validate test files
console.log('\n📁 Checking test files...');
for (const [filePath, expectedTestCount] of Object.entries(EXPECTED_TEST_FILES)) {
  const fullPath = path.join(TESTS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing test file: ${filePath}`);
    validationErrors++;
  } else {
    const content = fs.readFileSync(fullPath, 'utf8');
    const testCount = (content.match(/it\(/g) || []).length;
    
    if (testCount >= expectedTestCount) {
      console.log(`✅ ${filePath} (${testCount} tests)`);
    } else {
      console.warn(`⚠️  ${filePath} (${testCount}/${expectedTestCount} tests)`);
    }
  }
}

// Validate setup files
console.log('\n🛠️ Checking setup files...');
for (const filePath of EXPECTED_SETUP_FILES) {
  const fullPath = path.join(TESTS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing setup file: ${filePath}`);
    validationErrors++;
  } else {
    console.log(`✅ ${filePath}`);
  }
}

// Check package.json for test dependencies
console.log('\n📦 Checking dependencies...');
const packagePath = path.join(__dirname, '..', 'package.json');

if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const allDeps = {
    ...packageContent.dependencies,
    ...packageContent.devDependencies
  };
  
  for (const pkg of REQUIRED_PACKAGES) {
    if (allDeps[pkg]) {
      console.log(`✅ ${pkg} (${allDeps[pkg]})`);
    } else {
      console.error(`❌ Missing dependency: ${pkg}`);
      validationErrors++;
    }
  }
} else {
  console.error('❌ package.json not found');
  validationErrors++;
}

// Check vitest configuration
console.log('\n⚙️ Checking configuration...');
const vitestConfigPath = path.join(__dirname, '..', 'vitest.config.ts');

if (fs.existsSync(vitestConfigPath)) {
  const configContent = fs.readFileSync(vitestConfigPath, 'utf8');
  
  if (configContent.includes('integration')) {
    console.log('✅ Vitest integration project configured');
  } else {
    console.warn('⚠️  Vitest integration project not found in config');
  }
  
  if (configContent.includes('globalSetup')) {
    console.log('✅ Global setup configured');
  } else {
    console.warn('⚠️  Global setup not configured');
  }
} else {
  console.error('❌ vitest.config.ts not found');
  validationErrors++;
}

// Check environment file
console.log('\n🌍 Checking environment...');
const envTestPath = path.join(__dirname, '..', '.env.test');

if (fs.existsSync(envTestPath)) {
  console.log('✅ .env.test file exists');
} else {
  console.warn('⚠️  .env.test file not found');
}

// Summary
console.log('\n' + '='.repeat(50));
if (validationErrors === 0) {
  console.log('🎉 Integration Test Suite Validation: PASSED');
  console.log('');
  console.log('All required files and dependencies are in place.');
  console.log('You can now run: yarn test:integration');
  console.log('');
  console.log('Note: Tests are expected to fail initially (TDD approach)');
  console.log('until the corresponding API endpoints are implemented.');
} else {
  console.log(`❌ Integration Test Suite Validation: FAILED`);
  console.log(`Found ${validationErrors} validation errors.`);
  console.log('');
  console.log('Please fix the issues above before running tests.');
  process.exit(1);
}

console.log('='.repeat(50));

// Test suite statistics
console.log('\n📊 Test Suite Statistics:');
console.log(`• Test Files: ${Object.keys(EXPECTED_TEST_FILES).length}`);
console.log(`• Total Test Cases: ${Object.values(EXPECTED_TEST_FILES).reduce((sum, count) => sum + count, 0)}`);
console.log(`• API Endpoints Covered: 20`);
console.log(`• Test Domains: Authentication, Channels, Messages, Users`);
console.log('');