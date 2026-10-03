$ErrorActionPreference = 'Stop'
$path = 'D:\WTZ\prts\cloud.txt'
$local = ([IO.File]::ReadAllText($path)).Trim()
if (-not $local) { Write-Output 'cloud.txt empty, skip'; exit 0 }

$f = 'D:\WTZ\prts\_cloud\_cred_in.txt'
[IO.File]::WriteAllText($f, "protocol=https`nhost=github.com`n`n")
$cred = cmd /c "git credential fill < $f" 2>$null
$tok = ($cred | Where-Object { $_ -like 'password=*' }) -replace 'password=',''
if (-not $tok) { Write-Output 'NO TOKEN'; exit 1 }
$H = @{ Authorization = 'token ' + $tok; 'User-Agent' = 'wtz'; 'Content-Type' = 'application/json' }
$repo = 'wtz-YEE/wtz-YEE.github.io'
$url = "https://api.github.com/repos/$repo/contents/cloud.txt"

# 去重：远端与本地一致则不推送
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
