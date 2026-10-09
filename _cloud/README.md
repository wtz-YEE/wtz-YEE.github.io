# WTZ 云端部署包（多主机版）

把本文件夹（`_cloud`）拷到任意主机，即可在该主机一键部署一套独立云端服务（留言板 / 私聊 / 访客统计 / 在线状态 / 风控）。

## 一、新电脑一键启动（3 步）

1. **装 Python 3**：https://www.python.org/downloads/ ，安装时勾选 **Add python.exe to PATH**
2. **装 cpolar**：https://www.cpolar.com/ 下载安装；注册账号后在个人后台复制你的 **authtoken**
3. **双击 `一键启动云端.cmd`**，按提示输入 authtoken（首次），脚本会自动：
   - 检测 Python 并自动安装 `flask` / `flask-cors` 依赖
   - 把 authtoken 写入 cpolar 配置，并定义 `guestbook` 隧道(8701)
   - 启动留言服务（后台）
   - 启动 cpolar 隧道
   - 抓取本机公网地址，合并进 `../cloud.txt`
   - 通过 GitHub API 推送 `cloud.txt`（前端自动读取）

> 首次推送需要本机已配置 GitHub 凭据（`git credential`），否则可先跳过推送，仅本机直连 `http://127.0.0.1:8701` 验证。

## 二、文件清单

| 文件 | 作用 |
| --- | --- |
| `guestbook_server.py` | 云端服务主程序（端口 8701） |
| `setup.py` | 环境检测与一键配置（装依赖 + cpolar authtoken + 隧道） |
| `一键启动云端.cmd` | 新电脑一键启动：装依赖 → 起服务 → 起隧道 → 抓地址 → 推送 |
| `云端守护.cmd` | 守护进程：每 60s 检测 8701 / cpolar，异常自动重启并刷新推送地址 |
| `启动留言服务.cmd` | 仅启动留言服务 |
| `get_url.py` | 从 cpolar 日志抓本机公网地址，多主机合并写入 cloud.txt |
| `push_cloud.ps1` | API 推送 cloud.txt 到 GitHub（带去重，地址未变则跳过） |
| `changelog.json` / `scores.json` 等 | 数据文件，首次启动服务自动创建 |

> 所有脚本均已改为**相对路径**（`%~dp0` / `__file__`），拷到任意目录无需改路径。

## 三、cpolar 配置说明

`setup.py` 会自动生成 `C:\Users\<你>\\.cpolar\cpolar.yml`：

```yaml
authtoken: <你的令牌>
tunnels:
  guestbook:
    proto: http
    addr: "8701"
```

已配置过则保留原配置，只补缺项。

## 四、多主机部署（多云集成）

每台主机各跑一份本部署包（各自独立留言数据）：

- 每台主机执行 `一键启动云端.cmd` → 本机公网地址**追加**进 GitHub `cloud.txt`
- index 启动读取多行地址列表，自动接入全部主机，请求自动故障转移
- 推送走 **api.github.com**（git 主域在本网络不通时也能推），首次需在主机上配置 git credential 存 token

## 五、权限体系

- `is_admin: true`：普通管理员（看用户名列、拉黑等受限能力）
- `is_root: true`：网站主权限（完整用户列表含密码、授权/撤销管理员、删除/拉黑任何用户、风控保护）——在 `users.json` 设置，或由主权限用户在管理面板操作
- 最高管理员（root）不可被删除/拉黑；风控扫描自动跳过 root

## 六、数据同步（多主机互通）

服务启动时自动执行一次数据同步：

1. 读取仓库根 `cloud.txt` 的**全部主机地址**
2. 逐个 PULL：拉取对方数据 → 合并进本机
3. 逐个 PUSH：把本机合并结果传回对方

**合并规则**：账号新用户并入、同名保留本机密码/经验取高/权限取或；留言/帖子/私聊/通知/审计按 id 去重合并；游戏分数同局取最高；日志写入 `sync.log`。

**同步密钥**：首次启动自动生成 `sync_key.txt`（32 位随机），多主机部署需把同一份 key 复制到各主机。接口：`/sync_data?key=K`（拉取）、`/sync_import?key=K`（导入）、`/sync_now?key=K`（手动触发）。

## 七、风控与维护

- **风控**：管理员上传关键词列表，主机每 10 秒自动扫描（用户名/留言/帖子/评论/私聊），命中即删账号（root/管理员豁免）
- **维护中**：仓库根 `cloud_fixing.txt` 写 `t` 时全站显示「维修中」遮罩（写 `f` 关闭），由主机守护进程自动检测并 API 推送 GitHub

## 八、常用接口

- `/health` 探活（多云切换用）
- `/guests` 全量留言 + 在线数
- `/guests_new?since=N` 增量留言（本地缓存同步用）
- `/ping` 登录心跳（30s 保活，在线状态实时）
- `/login` `/register` `/guest_add` `/guest_like` `/pm_send` `/admin_users` `/admin_set_admin` …（与主站一致）

## 九、注意事项

- 云端地址变化后，index 从 GitHub `cloud.txt` 自动同步（也可在配置面板手动改）
- 数据文件（`users.json` / `guestbook.json` / `pm.json` / `notifications.json` / `posts.json` / `audit_log.json`）首次启动自动创建，位于本脚本同目录
- cpolar 免费版公网地址会变，长期运行请使用 `云端守护.cmd`（自动刷新推送）
