# WTZ 云端部署包（多主机版）

把本文件夹拷到任意主机，即可在该主机部署一套独立云端服务（留言板 / 私聊 / 访客统计 / 在线状态 / 风控）。

## 一、文件清单

| 文件 | 作用 |
| --- | --- |
| `guestbook_server.py` | 云端服务主程序（端口 8701） |
| `一键启动云端.bat` | 启动服务 + 抓公网地址 + API 推送 cloud.txt |
| `云端守护.bat` | 守护进程：每 60s 检测 8701/4040，挂了自动重启并刷新推送地址 |
| `启动留言服务.bat` | 仅启动留言服务 |
| `get_url.py` / `get_url.ps1` | 从 cpolar 日志抓取本机公网地址，多主机合并到 cloud.txt |
| `push_cloud.ps1` | API 推送 cloud.txt 到 GitHub（带去重，地址未变则跳过） |
| `changelog.json` / `scores.json` | 更新日志 / 游戏积分（首次启动自动创建数据文件） |

## 二、单机快速启动

1. 已安装：Python 3 + cpolar（并已执行 `cpolar authtoken <你的令牌>` 登录）
2. 确保 `C:\Users\Administrator\.cpolar\cpolar.yml` 含 guestbook 隧道：

   ```yaml
   authtoken: <你的令牌>
   tunnels:
     guestbook:
       proto: http
       addr: "8701"
   ```

3. 双击 `一键启动云端.bat`：启动服务、抓地址、合并并 API 推送 `cloud.txt`
4. 长期运行请用 `云端守护.bat`（自动重启 + 地址刷新推送）

> 注意：脚本内路径写死为 `D:\WTZ\prts`，换主机部署时按需全局替换。

## 三、多主机部署（多云端集成）

每台主机各跑一份本部署包（各自独立的留言数据）。

- 每台主机执行「一键启动云端.bat」→ 本机公网地址**追加**进 GitHub `cloud.txt`
- index 启动读取多行地址列表，自动接入全部主机，请求自动故障转移
- 推送走 **api.github.com**（git 主域在本网络不通），首次需在主机上配置 git credential 存 token

## 四、权限体系

- `is_admin: true`：普通管理员（看用户名列表、拉黑等受限能力）
- `is_root: true`：网站主权限（完整用户列表含密码、授予/撤销管理员、删除/拉黑任何用户、风控保护）——在 `users.json` 中设置，或由主权限用户在管理面板操作
- 最高管理员（root）不可被删除/拉黑；风控扫描自动跳过 root

## 四·五、数据同步（多主机互通）

**服务启动时**自动执行一次数据同步：

1. 读取仓库根 cloud.txt 的**全部主机地址**
2. 逐个 PULL：拉取对方数据 → 合并进本机
3. 逐个 PUSH：把本机合并结果传输回对方

**合并规则**：

- 账号：新用户并入；同名用户保留本机密码/密保，经验取高、权限取或（is_root/is_admin）、资料缺失项补全；会话不跨机
- 留言/帖子/私聊/通知/审计/更新日志：按 id 去重合并
- 游戏分数：同一局取最高分
- 日志写入本目录 sync.log

**同步密钥**：

- 首次启动自动生成 sync_key.txt（32 位随机）；**多主机部署需把同一份 key 复制到各主机**
- 接口：/sync_data?key=K（拉取）、/sync_import?key=K（导入）、/sync_now?key=K（手动触发）
- key 错误返回 403；单机（cloud.txt 无其他主机）自动跳过

## 五、风控与维修


- **风控**：管理员上传关键词列表，主机每 10 秒自动扫描（用户名/留言/帖子/评论/私聊），命中即删账号（root/管理员豁免）
- **维修中**：仓库根 `cloud_fixing.txt` 写 `t` 时全站显示「维修中」遮罩（写 `f` 关闭）。该文件由主机守护进程自动检测并 API 推送 GitHub

## 六、常用接口

- `/health` 探活（多云端切换用）
- `/guests` 全量留言 + 在线数
- `/guests_new?since=N` 增量留言（本地缓存同步用）
- `/ping` 登录心跳（60s 保活，在线状态实时）
- `/login` `/register` `/guest_add` `/guest_like` `/pm_send` `/admin_users` `/admin_set_admin` …（与主站一致）

## 七、注意

- 云端地址变化后，index 从 GitHub `cloud.txt` 自动同步（也可在配置面板手动改）
- 数据文件（`users.json` / `guestbook.json` / `pm.json` / `notifications.json` / `posts.json` / `audit_log.json`）首次启动自动创建，位于脚本同目录
