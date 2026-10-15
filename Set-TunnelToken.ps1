param([switch]$FromClipboard)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bookFinderPointer = [IntPtr]::Zero
if (-not $FromClipboard) {
    $bookFinderSecret = Read-Host 'Paste the FULL Docker command copied from the NEW Book Finder tunnel (hidden)' -AsSecureString
    $bookFinderPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($bookFinderSecret)
}
try {
    if ($FromClipboard) { $bookFinderInput = [string](Get-Clipboard -Raw); $bookFinderInput = $bookFinderInput.Trim() } else { $bookFinderInput = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bookFinderPointer).Trim() }
    $bookFinderMatch = [regex]::Match($bookFinderInput, '(?:^|\s)--token(?:\s+|=)(?:"([^"\s]+)"|''([^''\s]+)''|([^\s]+))\s*$')
    if ($bookFinderMatch.Success) {
        $bookFinderToken = @($bookFinderMatch.Groups[1].Value, $bookFinderMatch.Groups[2].Value, $bookFinderMatch.Groups[3].Value) | Where-Object { $_ } | Select-Object -First 1
    } else {
        $bookFinderToken = $bookFinderInput.Trim('"', "'")
    }
    if ($bookFinderToken.Length -lt 30 -or $bookFinderToken -notmatch '^[A-Za-z0-9_+/=-]+$') { throw 'Nothing saved. Copy the complete Cloudflare Docker command and paste again.' }
    New-Item -ItemType Directory -Path '.secrets' -Force | Out-Null
    [IO.File]::WriteAllText((Join-Path $PSScriptRoot '.secrets\tunnel-token'), $bookFinderToken, [Text.UTF8Encoding]::new($false))
} finally {
    if ($bookFinderPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bookFinderPointer) }
    $bookFinderToken = $null
    $bookFinderInput = $null
    $bookFinderMatch = $null
    if ($bookFinderSecret) { $bookFinderSecret.Dispose() }
}
Write-Host 'Saved locally. No token is printed.'

