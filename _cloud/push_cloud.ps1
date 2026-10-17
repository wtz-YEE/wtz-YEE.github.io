$ErrorActionPreference = 'Stop'
$cloudDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$path = Join-Path $cloudDir '..\cloud.txt'
$local = ([IO.File]::ReadAllText($path)).Trim()
if (-not $local) { Write-Output 'cloud.txt empty, skip'; exit 0 }

$tf = Join-Path $cloudDir ('_ci_' + [guid]::NewGuid().ToString('N') + '.txt')
[IO.File]::WriteAllText($tf, "protocol=https`nhost=github.com`n`n")
try {
  $acl = Get-Acl $tf
  $acl.SetAccessRuleProtection($true, $false)
  $rule = New-Object Security.AccessControl.FileSystemAccessRule([Environment]::UserName, 'FullControl', 'Allow')
  $acl.AddAccessRule($rule)
  Set-Acl $tf $acl
} catch {}
try {
  $cred = cmd /c "git credential fill < $tf" 2>$null
} finally {
  [IO.File]::Delete($tf)
}
$tok = ($cred | Where-Object { $_ -like 'password=*' }) -replace 'password=',''
if (-not $tok) { Write-Output 'NO TOKEN'; exit 1 }
$H = @{ Authorization = 'token ' + $tok; 'User-Agent' = 'wtz'; 'Content-Type' = 'application/json' }
$repo = 'wtz-YEE/wtz-YEE.github.io'
$url = "https://api.github.com/repos/$repo/contents/cloud.txt"

$remote = ''
try { $meta = Invoke-RestMethod -Uri $url -Headers $H -TimeoutSec 60; $remote = ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($meta.content))).Trim() } catch {}
if ($remote -eq $local) { Write-Output 'cloud.txt already up to date, skip'; exit 0 }

$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($path))
$sha = $null
try { $m2 = Invoke-RestMethod -Uri $url -Headers $H -TimeoutSec 60; $sha = $m2.sha } catch {}
$body = @{ message = 'cloud: update public url ' + $local; content = $b64 }
if ($sha) { $body.sha = $sha }
Invoke-RestMethod -Uri $url -Method Put -Headers $H -Body ($body | ConvertTo-Json) -TimeoutSec 120 | Out-Null
Write-Output 'cloud.txt pushed'
$meta2 = Invoke-RestMethod -Uri $url -Headers $H -TimeoutSec 60
$txt = ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($meta2.content))).Trim()
Write-Output ('verify: ' + $txt)

# SIG # Begin signature block
# MIIFvAYJKoZIhvcNAQcCoIIFrTCCBakCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCA3gKqJXcyqfBpw
# dwK06k6kbNfQ0YojH684KjOwEtKJ/aCCAyQwggMgMIICCKADAgECAhBE5/d/RP1H
# okwBK/3YjG8kMA0GCSqGSIb3DQEBCwUAMCgxDDAKBgNVBAoMA1dUWjEYMBYGA1UE
# AwwPV1RaIENsb3VkIEd1YXJkMB4XDTI2MTAxNzAzNDQxNloXDTMxMTAxNzAzNTQx
# NFowKDEMMAoGA1UECgwDV1RaMRgwFgYDVQQDDA9XVFogQ2xvdWQgR3VhcmQwggEi
# MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDR+B/LHafl5HbxrKwd02an5LMs
# kbw5WkQZCS6BaOmpSOAt78MGDDi4h8XD984UTojiz/HDIVqfgqlFnI5BvksC7jgv
# 1BvUbjdpTpmDG5lzkZ5Kl0gXEdccm5a+eZ0BttOh8xP6ZOUdwWsC9PCZCHIwDDYr
# v2Vunon0WDCj0piWrOg5N1g6Q/4pVU7F1GPeAeNQyYzhVV9RYcE8gnz4G7LhK6hl
# 3PD6s4ivn33qL4R2KRGScaKPGhBKOdah0en12ass6Av1zE2xOw8bgudyP9ZaQtv2
# bbWwbHNtjJ4U0JTuZ8HCQvpfLYDXU9ES9snQKwDyn9e6GLKe/y8tXS0YxNaVAgMB
# AAGjRjBEMA4GA1UdDwEB/wQEAwIHgDATBgNVHSUEDDAKBggrBgEFBQcDAzAdBgNV
# HQ4EFgQUogKssx97PYPD2YNqHvh084K08gAwDQYJKoZIhvcNAQELBQADggEBAKcs
# e+u+3riERwUOWRPBYVSc9yDICTMJxZhULfc3qrzO6y7+L7udnoqDBUW3YyKuCAuk
# vnBepNGpKiXFQW6g9sQy9QVi5rUOAoWfYMKSiL+v12s/3s6QxQMWSybivd8Vn/Cz
# IJ6RO8U68vKhoeEMvQL3P+aqibQstXVQ8RFP/gKau/im5O/gO+UHF+jiKwl6tYrJ
# lghGm7mXr89ZBmDhjGFN5yCs4OLddSB10AKNNwExLdlZVmO+QvAfZej3XINP4wn+
# 8wU9/ViDWr69x99V/shJ+kgVmU7F4qcFTtdY+aoTou7a6hjYZEAuFW0joeY6k2lH
# vsjeXTKuu07j7zU5XtcxggHuMIIB6gIBATA8MCgxDDAKBgNVBAoMA1dUWjEYMBYG
# A1UEAwwPV1RaIENsb3VkIEd1YXJkAhBE5/d/RP1HokwBK/3YjG8kMA0GCWCGSAFl
# AwQCAQUAoIGEMBgGCisGAQQBgjcCAQwxCjAIoAKAAKECgAAwGQYJKoZIhvcNAQkD
# MQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcCARUwLwYJ
# KoZIhvcNAQkEMSIEIOnVqRh9OqIp+munmf7mrIoJPEWHnW+T1WQpaeFRY3JbMA0G
# CSqGSIb3DQEBAQUABIIBAEnsdVWMdeyKNyd96B/hKZXR3rQ4ixUuPYqKLcvMPmE7
# TmnsLwqF+/rUiG0/tIwYqXVXV9a3I8Nc+ASAkTDsui/uVxfd6Wz2dtctEJjZGiwS
# 1fp80BeHJSrDl9rqEdLm4QepMEY5nMUaIRRfpT+NKjNs6U+/+JYhYpzyH5N8krHk
# eUu1IDoWv3SCEty/HoUql+UWKxPQfZrq5R3cQu45auA8WzZ1aTOvVMKf2qW4TdA0
# od935auMEMoVvZAxko8g05PwmahbjVqO98XRFfVtjFrbExvv4WRfTZ1p6qBV/QFk
# XRbP3FdSu9hjNe/pO/+ZAtL84fU+jPOhmnvZkWfiKiE=
# SIG # End signature block
