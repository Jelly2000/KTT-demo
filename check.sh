#!/bin/bash

echo "🧪 Running pre-push checks..."

echo "1️⃣ Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed!"
    exit 1
fi
echo "✅ Linting passed"

echo ""
echo "2️⃣ Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi
echo "✅ All tests passed"

echo ""
echo "3️⃣ Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"

echo ""
echo "🎉 All checks passed! Ready to push to GitHub."