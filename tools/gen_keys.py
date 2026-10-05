import sys
import datetime as d
a=d.datetime.now()
if len(sys.argv)>2:
    a=a.replace(day=int(sys.argv[1]),hour=int(sys.argv[2]))
b=a.day
c=a.hour
print('时间:'+a.strftime('%Y-%m-%d %H:%M'))
print('第二层密钥:'+f'{b:02d}{c:02d}{(b*7+c*3)%100:02d}')
p=f'{b:02d}{c:02d}{(b*11+c*7)%100:02d}'
w=[(b*(i+1)+c)%10 for i in range(6)]
e=''.join(str((int(p[i])+w[i])%10) for i in range(6))[::-1]
print('第三层密文:'+e)
print('第三层明文:'+p)
input()
