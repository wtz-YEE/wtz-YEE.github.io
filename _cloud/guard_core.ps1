param([string]$Mode='check')
$ErrorActionPreference='Stop'
$d=Split-Path -Parent $MyInvocation.MyCommand.Path
$tp='28DFF1AFE08E98ED5C5FA873665E0C7AFAFF62C2'
$log=Join-Path $d 'guard.log'
function L($m){try{[IO.File]::AppendAllText($log,("[{0}] {1}`n" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'),$m))}catch{}}
$cer=Join-Path $d 'wtz-cloud-guard.cer'
if(Test-Path $cer){
 Import-Certificate -FilePath $cer -CertStoreLocation Cert:\CurrentUser\TrustedPublisher -ErrorAction SilentlyContinue|Out-Null
 Import-Certificate -FilePath $cer -CertStoreLocation Cert:\CurrentUser\Root -ErrorAction SilentlyContinue|Out-Null
}
function Sig($f){
 try{
  $s=Get-AuthenticodeSignature $f
  if($s.Status -eq 'NotSigned'){return $false}
  return $s.SignerCertificate.Thumbprint -eq $tp
 }catch{return $false}
}
$fs=@('guard_core.ps1','get_url.ps1','push_cloud.ps1')
foreach($x in $fs){
 $p=Join-Path $d $x
 if(-not (Test-Path $p)){L "missing $x";Write-Host "[防护] 缺少 $x";exit 1}
 if(-not (Sig $p)){L "sig fail $x";Write-Host "[防护] $x 签名校验失败，已中止";exit 1}
}
if($Mode -eq 'mutex'){
 $m=New-Object Threading.Mutex($false,'Global\WTZCloudGuard')
 if(-not $m.WaitOne(0)){Write-Host '[防护] 已有一个云端守护实例在运行';exit 2}
 $m.ReleaseMutex()
}
L 'guard ok'
exit 0

# SIG # Begin signature block
# MIIFvAYJKoZIhvcNAQcCoIIFrTCCBakCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBoj5AnbgweOqkv
# bjhD0gk2P4oiuN3svoIQyUawyGVh+aCCAyQwggMgMIICCKADAgECAhBE5/d/RP1H
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
# KoZIhvcNAQkEMSIEIIzNNTJqfsKv6+UHxlG373bSuBg/uzcQsVnX+ae4asTwMA0G
# CSqGSIb3DQEBAQUABIIBAJXCwCpgPB/IjfG6uHisuxZMODx3r+/2g6f/opHmynWf
# 7jf2T5rzxoMb7pvgUYil6kpUeE354yCrHbyG3XAf6AsccnCvOj8v/LqDdj+MXxri
# lGscpG8xuYNjB6z/iixprH/hIpPv4SSKaclL0ZfDt1troIPL0vjuSnwJBgeyYGVB
# 9krnm4EOzY/8WM++qVn8vQmZRXoScd0A79a5QdNnHVGMrqxwjhcREERkj3IS9aNh
# RCgPeBZB8keKpnbouB4orqc9FgH2a9PoCaMK/Rav6RaAi3DOKBgC9zP+gWplSedh
# +RIgOHx7DdEagKvi4ml/rjZpy8Jd09ikvF+d/y2usNU=
# SIG # End signature block
