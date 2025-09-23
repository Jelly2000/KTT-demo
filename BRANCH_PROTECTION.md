# Branch Protection Setup

To enforce that all tests must pass before code can be pushed, follow these steps:

## 1. GitHub Actions (Already Set Up)
The CI workflow in `.github/workflows/ci.yml` will run on every push and must pass.

## 2. Set Up Branch Protection Rules

### For the `master` branch:
1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Click **Add rule** or **Edit** existing rule for `master`
4. Configure these settings:

#### Required Status Checks:
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Select these required checks:
  - `Run Tests`
  - `Test Node.js 18.x` 
  - `Test Node.js 20.x`

#### Additional Protections:
- ✅ **Restrict pushes that create files over 100MB** (optional)
- ✅ **Require signed commits** (optional, for extra security)

## 3. What This Ensures:

### On Every Push:
- ✅ Linting must pass (`npm run lint`)
- ✅ All tests must pass (`npm test`) 
- ✅ Build must succeed (`npm run build`)
- ✅ Tests run on Node.js 18.x and 20.x

### Result:
- If ANY test fails → ❌ **Push is rejected**
- If ALL tests pass → ✅ **Push is accepted**

## 4. Local Development:
Always run before pushing:
```bash
npm run lint  # Check code style
npm test      # Run all tests
npm run build # Verify build works
```

## 5. GitHub Actions Status:
You'll see status checks on:
- Every commit in the GitHub interface
- Pull request pages  
- Branch protection status

This ensures code quality and prevents broken code from entering the repository!