$u = & python 'D:\WTZ\prts\_cloud\get_url.py'
if ($u) {
    [IO.File]::WriteAllText('D:\WTZ\prts\云端地址.txt', $u, (New-Object Text.UTF8Encoding $false))
    Set-Clipboard -Value $u
    Write-Host ''
    Write-Host ('  本机公网地址: ' + $u)
    Write-Host '  cloud.txt 已合并多主机地址（保留其他主机的）'
    Write-Host '  接下来将推送 GitHub 供 index 自动读取'
    Write-Host ''
}
else {
    Write-Host ''
    Write-Host '  获取失败：cpolar 日志中未找到 guestbook 隧道'
    Write-Host '  请确认 cpolar.yml 包含 guestbook 隧道(8701) 且服务在运行'
    Write-Host ''
}
