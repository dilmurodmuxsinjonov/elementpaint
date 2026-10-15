param([int]$Port = 8092)
$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$bundledPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$pythonCommand = if (Test-Path -LiteralPath $bundledPython) { $bundledPython } else { 'python' }
Set-Location -LiteralPath $projectDirectory
& $pythonCommand -c "import PIL" 2>$null
if ($LASTEXITCODE -ne 0) { throw 'Pillow kerak. Python muhitida admin/requirements.txt paketlarini o‘rnating.' }
Write-Host "Panel: http://127.0.0.1:$Port/admin/"
& $pythonCommand -m admin.server --port $Port
