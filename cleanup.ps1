# PowerShell cleanup script
Write-Host "🧹 Cleaning up deprecated files..."

# Remove .bak files
Get-ChildItem -Recurse -Include *.bak | ForEach-Object { git rm $_.FullName }

# Remove deprecated scripts
Get-ChildItem scripts -Recurse -Include *deprecated* -ErrorAction SilentlyContinue | ForEach-Object { git rm $_.FullName }

# Remove specific deprecated files
$filesToRemove = @(
    "migrate.sh",
    "codespaces-vite-fix.sh", 
    "codespaces-500-diagnosis.sh",
    "test-servers.sh",
    "background.html",
    "broadcast_overlay.html"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        git rm $file
    }
}

Write-Host "✅ Cleanup complete"