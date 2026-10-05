# -*- coding: utf-8 -*-
import json,os,shutil,io,sys,datetime

R=os.path.dirname(os.path.abspath(__file__))
F=[]
for r,d,fs in os.walk(R):
    d[:]=[x for x in d if not x.startswith('.') and x!='node_modules']
    for f in fs:
        if f.endswith('.json'): F.append(os.path.join(r,f))
F.sort()

def rd(p):
    return json.load(io.open(p,encoding='utf-8'))
def wt(p,d):
    io.open(p,'w',encoding='utf-8',newline='\n').write(json.dumps(d,ensure_ascii=False,indent=1))
def bak(p):
    b=p+'.bak_'+datetime.datetime.now().strftime('%H%M%S')
    shutil.copy2(p,b)
    print('已备份 -> '+b)
def fnd(d,k):
    out=[]
    def w(x):
        if isinstance(x,dict):
            for a,v in x.items():
                if k in str(a) or k in str(v): out.append(x)
                w(v)
        elif isinstance(x,list):
            for v in x: w(v)
    w(d)
    return out

def menu():
    while True:
        print('\n'*2+'='*50)
        print('JSON 管理器  共 %d 个文件' % len(F))
        for i,f in enumerate(F):
            try:
                d=rd(f); n=len(d) if isinstance(d,list) else len(d)
                t='list' if isinstance(d,list) else 'dict'
            except Exception as e:
                t='ERR'; n='-'
            print('%d) %-40s [%s %s]' % (i,os.path.relpath(f,R),t,n))
        print('q) 退出')
        c=input('\n选择文件序号: ').strip().lower()
        if c=='q': return
        if not c.isdigit(): print('无效'); continue
        i=int(c)
        if i>=len(F): print('越界'); continue
        work(F[i])

def work(f):
    while True:
        d=rd(f)
        print('\n'*2+'='*50)
        print('文件: '+os.path.relpath(f,R))
        if isinstance(d,list):
            print('列表共 %d 条' % len(d))
            for j,x in enumerate(d[:25]):
                s=x.get('id',j) if isinstance(x,dict) else j
                print('  [%d] id=%s %s' % (j,s,json.dumps(x,ensure_ascii=False)[:110]))
            if len(d)>25: print('  ... 其余 %d 条' % (len(d)-25))
        else:
            print('对象 keys: '+', '.join(list(d.keys())[:40]))
            print(json.dumps(d,ensure_ascii=False,indent=1)[:1500])
        print('-'*40)
        print('操作: 1查看全 2搜索 3新增 4编辑 5删除 6备份 7改json 8返回')
        c=input('>: ').strip()
        if c=='8': return
        if c=='7':
            print(json.dumps(d,ensure_ascii=False,indent=1))
            s=input('粘贴完整json覆盖(留空取消): ')
            if s.strip():
                bak(f)
                try:
                    nd=json.loads(s)
                    wt(f,nd); print('已覆盖')
                except Exception as e:
                    print('json错误: '+str(e))
            continue
        if c=='6': bak(f); continue
        if c=='1':
            print(json.dumps(d,ensure_ascii=False,indent=1)); continue
        if c=='2':
            k=input('关键词: ').strip()
            if not k: continue
            rs=fnd(d,k)
            print('命中 %d 条:' % len(rs))
            for x in rs[:15]: print('  '+json.dumps(x,ensure_ascii=False)[:160])
            continue
        if c in ('3','4','5'):
            if not isinstance(d,list):
                print('仅支持列表操作'); continue
            if c=='3':
                print('逐项输入（留空即不填）')
                s=input('新增条目的 json 片段(如 {"title":"x"}): ')
                if not s.strip(): continue
                try:
                    nx=json.loads(s)
                except Exception:
                    print('json错误'); continue
                bak(f)
                d.append(nx); wt(f,d); print('已新增 -> '+os.path.relpath(f,R)); continue
            i2=input('条目序号(0-{0}): '.format(len(d)-1)).strip()
            if not i2.isdigit() or int(i2)>=len(d): print('无效'); continue
            i2=int(i2)
            x=d[i2]
            print('当前: '+json.dumps(x,ensure_ascii=False)[:200])
            if c=='5':
                bak(f)
                d.pop(i2); wt(f,d); print('已删除'); continue
            s=input('新的 json 片段(留空不改): ')
            if s.strip():
                try: nx=json.loads(s)
                except Exception: print('json错误'); continue
                bak(f); d[i2]=nx; wt(f,d); print('已更新')

if __name__=='__main__':
    menu()
