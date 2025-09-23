#!/bin/bash

# Integration Test Runner Script
echo "🚀 Starting Chat Application API Integration Tests"
echo "=================================================="

# Check if .env.test exists
if [ ! -f ".env.test" ]; then
    echo "❌ Error: .env.test file not found!"
    echo "Please copy .env.test.example to .env.test and configure test environment variables."
    exit 1
fi

# Load test environment variables
export $(cat .env.test | grep -v '^#' | xargs)

echo "📋 Test Environment Configuration:"
echo "   API_URL: $API_URL"
echo "   NODE_ENV: $NODE_ENV"
echo "   DB_NAME: $DB_NAME"
echo ""

# Check if API server is running (optional)
if command -v curl &> /dev/null; then
    echo "🔍 Checking if API server is running..."
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        echo "✅ API server is responding at $API_URL"
    else
        echo "⚠️  Warning: API server may not be running at $API_URL"
        echo "   Tests will expect 404/500 errors for unimplemented endpoints"
    fi
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run different test modes based on argument
case "${1:-run}" in
    "watch")
        echo "👀 Running tests in watch mode..."
        npm run test:watch
        ;;
    "coverage")
        echo "📊 Running tests with coverage..."
        npm run test:coverage
        ;;
    "ui")
        echo "🎨 Opening test UI..."
        npm run test:ui
        ;;
    "auth")
        echo "🔐 Running authentication tests only..."
        npx vitest run tests/integration/auth/
        ;;
    "channels")
        echo "💬 Running channel tests only..."
        npx vitest run tests/integration/channels/
        ;;
    "users")
        echo "👥 Running user tests only..."
        npx vitest run tests/integration/users/
        ;;
    *)
        echo "🧪 Running all integration tests..."
        npm run test:run
        ;;
esac

echo ""
echo "✨ Integration tests completed!"
echo ""
echo "📝 Test Results Summary:"
echo "   - Expected failures: 404/500 errors for unimplemented endpoints"
echo "   - Syntax/import errors: Should be 0"
echo "   - Environment setup errors: Should be 0"
echo ""
echo "📚 Available test modes:"
echo "   ./run-tests.sh          - Run all tests once"
echo "   ./run-tests.sh watch    - Run tests in watch mode"
echo "   ./run-tests.sh coverage - Run tests with coverage report"
echo "   ./run-tests.sh ui       - Open test UI"
echo "   ./run-tests.sh auth     - Run authentication tests only"
echo "   ./run-tests.sh channels - Run channel tests only" 
echo "   ./run-tests.sh users    - Run user tests only"