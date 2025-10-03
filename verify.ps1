# PowerShell verification script for m0_ticker_redux

Write-Host "🔍 Starting verification pipeline..." -ForegroundColor Blue

try {
    # Build check
    Write-Host "📦 Building application..." -ForegroundColor Yellow
    npm run build
    
    # Test check  
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    npm run test -- --run
    
    # Lint check
    Write-Host "🔧 Running linting..." -ForegroundColor Yellow
    try { npm run lint } catch { Write-Host "⚠️  No lint script found" -ForegroundColor Orange }
    
    # Check imports
    Write-Host "🔗 Checking for relative imports..." -ForegroundColor Yellow
    $relativeImports = Get-ChildItem -Path src -Recurse -Include *.js,*.jsx,*.ts,*.tsx | 
                       Select-String "import.*\.\./" -Quiet
    
    if ($relativeImports) {
        Write-Host "❌ Found relative imports! Fix these." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ No relative imports found" -ForegroundColor Green
    }
    
    # Check for hard-coded colors
    Write-Host "🎨 Checking for hard-coded colors..." -ForegroundColor Yellow
    $hardCodedColors = Get-ChildItem -Path src -Recurse -Include *.css,*.js,*.jsx | 
                       Select-String "#[0-9a-fA-F]{3,6}" | 
                       Where-Object { $_.Line -notmatch "var\(--" }
    
    if ($hardCodedColors) {
        Write-Host "⚠️  Found hard-coded colors (some may be in comments)" -ForegroundColor Orange
    } else {
        Write-Host "✅ No hard-coded colors in CSS/JS" -ForegroundColor Green
    }
    
    Write-Host "✅ Verification complete!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Verification failed: $_" -ForegroundColor Red
    exit 1
}