$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$sitio = "https://sistema-municipal-directoalvecino.netlify.app"
$envPath = Join-Path $PSScriptRoot ".env"

function Read-EnvVar([string]$name) {
  if (-not (Test-Path $envPath)) {
    Write-Host "No se encontro: $envPath" -ForegroundColor Red
    return $null
  }
  foreach ($raw in Get-Content $envPath -Encoding UTF8) {
    $line = $raw.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { continue }
    $prefix = $name + "="
    if ($line.StartsWith($prefix)) {
      return $line.Substring($prefix.Length).Trim().Trim('"').Trim("'")
    }
  }
  return $null
}

try {
  $panel = Read-EnvVar "PANEL_PASSWORD"
  $seed = Read-EnvVar "SEED_SECRET"
  $intentos = @()
  if ($panel) { $intentos += $panel }
  if ($seed) { $intentos += $seed }

  if ($intentos.Count -eq 0) {
    Write-Host "ERROR: no leyo PANEL_PASSWORD ni SEED_SECRET" -ForegroundColor Red
    Write-Host "Archivo: $envPath"
    exit 1
  }

  Write-Host ""
  Write-Host "Llamando a $sitio/api/admin/seed ..."
  Write-Host ""

  $ok = $false
  foreach ($secret in $intentos) {
    try {
      $r = Invoke-WebRequest -Uri "$sitio/api/admin/seed" -Method POST -Headers @{
        "x-seed-secret" = $secret
      } -UseBasicParsing
      Write-Host "RESPUESTA:" -ForegroundColor Green
      Write-Host $r.Content
      Write-Host ""
      Write-Host "LISTO. Entra al panel y carga Referentes." -ForegroundColor Green
      $ok = $true
      break
    } catch {
      $body = ""
      if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
      }
      if ($body -notmatch "Secreto incorrecto") {
        Write-Host "ERROR:" -ForegroundColor Red
        if ($body) { Write-Host $body } else { Write-Host $_.Exception.Message }
        exit 1
      }
    }
  }

  if (-not $ok) {
    Write-Host "ERROR: Secreto incorrecto en Netlify." -ForegroundColor Red
    Write-Host "Revisa PANEL_PASSWORD en Environment variables (Production)."
    exit 1
  }
} catch {
  Write-Host "ERROR inesperado:" -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}
