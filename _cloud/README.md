# WTZ 云端部署包（多主机版）

把本文件夹拷到任意主机，即可在该主机部署一套独立云端服务（留言板 / 私聊 / 访客统计 / 在线状态）。

## 一、单机快速启动

1. 已安装：Python 3 + cpolar（并已执行 `cpolar authtoken <你的令牌>` 登录）
2. 确保 `C:\Users\Administrator\.cpolar\cpolar.yml` 含 guestbook 隧道：

   ```yaml
   authtoken: <你的令牌>
   tunnels:
     guestbook:
       proto: http
       addr: "8701"
   ```

3. 双击 `一键启动云端.bat`，脚本自动完成：
   - 启动留言服务（8701 端口，服务脚本 `guestbook_server.py`）
   - 检查/提示启动 cpolar 隧道
   - 从 cpolar 日志抓取本机公网地址
   - **合并**到 `cloud.txt`（保留其他主机的地址）并推送 GitHub

单独启动留言服务：双击 `启动留言服务.bat`。

## 二、多主机部署（多云端集成）

每台主机各跑一份本部署包（各自独立的留言数据）。

- 每台主机执行一次「一键启动云端.bat」→ 自己的公网地址会被**追加**进 GitHub 的 `cloud.txt`
- 网站 index 启动时读取 `cloud.txt`，得到**多行地址列表**，自动接入全部主机
- 请求自动**故障转移**：某台主机挂了，index 自动切换到下一台，页面不报错
- 配置面板也可手动填多地址：逗号 / 换行 / 分号分隔

## 三、数据与账号

- 首次启动自动创建 `guestbook.json`（留言）、`users.json`（账号）、`pm.json`（私聊）
- 每台主机账号独立；在「机密终端」里用 `/grant <账号>` 可给其他主机账号授权
- 管理员账号：在 `users.json` 中把 `is_admin` 设为 `true`（或通过机密终端 admin 验证后授权）

## 四、常用接口

- `/health` 探活（多云端切换用）
- `/guests` 全量留言 + 在线数
- `/guests_new?since=N` 增量留言（本地缓存同步用）
- `/login` `/register` `/guest_add` `/guest_like` `/pm_send` …（与旧版一致）

## 五、注意

- 云端地址变化后，index 会从 GitHub `cloud.txt` 自动同步（也可在留言板配置面板手动改）
- 本部署包可放进任何项目目录使用；`cloud.txt` 位于仓库根目录由脚本自动维护
