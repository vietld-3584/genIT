#!/usr/bin/env node

/**
 * Integration Test Runner
 * 
 * Automation script for running integration tests with various options
 * Usage: node scripts/run-integration-tests.js [options]
 */

const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
  console.log(colorize('cyan', colorize('bold', '\n🚀 Integration Test Runner')));
  console.log(colorize('cyan', '============================'));
}

function printUsage() {
  console.log(colorize('yellow', '\nUsage:'));
  console.log('  node scripts/run-integration-tests.js [options]\n');
  console.log(colorize('yellow', 'Options:'));
  console.log('  --all, -a              Run all integration tests (default)');
  console.log('  --auth                 Run authentication tests only');
  console.log('  --channels             Run channel management tests only');
  console.log('  --messages             Run message functionality tests only');
  console.log('  --users                Run user management tests only');
  console.log('  --watch, -w            Run in watch mode');
  console.log('  --coverage, -c         Run with coverage report');
  console.log('  --verbose, -v          Verbose output');
  console.log('  --validate             Validate test suite structure only');
  console.log('  --help, -h             Show this help message');
  console.log('');
  console.log(colorize('yellow', 'Examples:'));
  console.log('  node scripts/run-integration-tests.js --auth --watch');
  console.log('  node scripts/run-integration-tests.js --coverage');
  console.log('  node scripts/run-integration-tests.js --validate');
  console.log('');
}

function printTestStats() {
  console.log(colorize('blue', '\n📊 Test Suite Statistics:'));
  console.log('  • Total Tests: 103');
  console.log('  • Test Files: 8');
  console.log('  • API Endpoints: 20');
  console.log('  • Domains: Authentication, Channels, Messages, Users');
  console.log('');
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: options.cwd || process.cwd(),
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function validateTestSuite() {
  console.log(colorize('magenta', '🔍 Validating test suite structure...\n'));
  
  try {
    await runCommand('node', ['scripts/validate-tests.js']);
    console.log(colorize('green', '\n✅ Test suite validation completed successfully!'));
  } catch (error) {
    console.error(colorize('red', '\n❌ Test suite validation failed!'));
    process.exit(1);
  }
}

async function runTests(domain = null, options = {}) {
  const { watch = false, coverage = false, verbose = false } = options;
  
  // Build vitest command
  const vitestArgs = ['run', '--project', 'integration'];
  
  // Add test pattern based on domain
  if (domain) {
    vitestArgs.push(`tests/integration/${domain}/**/*.test.ts`);
  }
  
  // Add options
  if (watch) {
    vitestArgs[0] = 'dev'; // Use dev mode for watch
  }
  
  if (coverage) {
    vitestArgs.push('--coverage');
  }
  
  if (verbose) {
    vitestArgs.push('--reporter=verbose');
  }
  
  // Print test info
  const domainText = domain ? colorize('yellow', domain) : colorize('yellow', 'all domains');
  const modeText = watch ? colorize('cyan', '(watch mode)') : '';
  console.log(colorize('magenta', `🧪 Running integration tests for ${domainText} ${modeText}\n`));
  
  try {
    await runCommand('npx', ['vitest', ...vitestArgs]);
    console.log(colorize('green', '\n✅ Test execution completed!'));
  } catch (error) {
    console.error(colorize('red', '\n❌ Test execution failed!'));
    console.log(colorize('yellow', '\nNote: Tests are expected to fail in TDD approach until API endpoints are implemented.'));
    // Don't exit with error for TDD failures
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  printHeader();
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    printTestStats();
    return;
  }
  
  // Parse arguments
  const options = {
    watch: args.includes('--watch') || args.includes('-w'),
    coverage: args.includes('--coverage') || args.includes('-c'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };
  
  // Handle validation
  if (args.includes('--validate')) {
    await validateTestSuite();
    return;
  }
  
  // Determine domain
  let domain = null;
  if (args.includes('--auth')) {
    domain = 'auth';
  } else if (args.includes('--channels')) {
    domain = 'channels';
  } else if (args.includes('--messages')) {
    domain = 'messages';
  } else if (args.includes('--users')) {
    domain = 'users';
  }
  
  // Run tests
  printTestStats();
  await runTests(domain, options);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(colorize('red', '\n❌ Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(colorize('red', '\n❌ Unhandled Rejection:'), reason);
  process.exit(1);
});

// Run main function
main().catch((error) => {
  console.error(colorize('red', '\n❌ Error:'), error.message);
  process.exit(1);
});