[TOC]
# 环境要求

> Linux(CentOS 7.2): 自由和开放源码的类UNIX操作系统。
> NodeJS(version 8.9): Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
> Nginx(version 1.12.2): 轻量级网页服务器、反向代理服务器。
> Mysql(version 5.6): 关系型数据库管理系统。
> Redis(version 3.6):内存存储的数据结构服务器，可用作数据库，高速缓存和消息队列代理。

## 环境准备
### CentOS7.2
购买链接 https://www.aliyun.com/
### nodejs 安装
---
1.安装依赖包:
`` yum -y install gcc gcc-c++ openssl-devel ``

2.下载源码包:
`` wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3.tar.gz ``
`` tar -zxvf node-v8.9.3.tar.gz ``
`` cd node-v8.9.3 ``

3.配置、编译、安装: 
`` ./configure --prefix=/usr/local/node ``
``  make && make install ``

4.测试是否安装成功:
 `` node -v ``
 `` npm -v ``

#### pm2 安装
pm2 是一个带有负载均衡功能的Node应用的进程管理器.
`` npm i -g pm2 ``

### 安装配置 Nginx
--- 
1.自动安装 Nginx。输入命令：
`` yum install nginx ``

2.启动 Nginx 服务。输入命令：
`` service nginx restart ``

3.命令行测试 Nginx 服务是否正常运行。输入命令：
`` wget http://127.0.0.1 ``

### Mysql安装
---
因CentOS已经使用MariaDB替代了MySQL，如直接输入``yum install mysql-server ``则安装MariaDB。
`` rpm -qa | grep maria ``
`` yum -y remove maria*** ``
[安装链接](https://www.ytyzx.org/index.php/%E5%A6%82%E4%BD%95%E5%9C%A8CentOS7%E4%B8%AD%E5%AE%89%E8%A3%85MySQL)

### Redis安装
---
1.下载Redis:
`` wget http://download.redis.io/releases/redis-4.0.7.tar.gz ``

2.解压Redis:
`` tar -zxvf redis-4.0.7.tar.gz ``

3.编译安装Redis:
``` 
yum install tcl
cd redis-4.0.7 
make 
make install 
```

4.配置Redis:
`` cp redis.conf /etc/ ``
为了让Redis后台运行，一般还需要修改redis.conf文件:
`` vim /etc/redis.conf ``
修改daemonize配置项为yes，使Redis进程在后台运行:
`` daemonize yes ``

5.启动Redis:
```
cd /usr/local/bin
./redis-server /etc/redis.conf
```

6.添加开机启动项:
`` echo "/usr/local/bin/redis-server /etc/redis.conf" >>/etc/rc.local ``

# 获取项目源代码

## 安装git 

## 获取源代码
1.下载源代码:
`` git clone https://github.com/autumnQH/ecough.git ``

2.安装依赖:
`` cd ecough ``
`` npm i ``

2.1.目录结构:
```
|ecough
|---app : 业务逻辑代码
|   └---config
|       └---wechat_meun.js   创建微信公众号菜单配置文件
|   └---controllers
|       └---my.js            获取产品，支付，退款, 收款通知
|       └---sms.js           阿里云短信服务
|       └---wechat.js        检查是否是微信发送过来的消息
|   └---dao   增删改查mysql
|       └---admin.js 
|       └---config.js  
|       └--- FAQ.js.        ·常见问题·
|       └---order.js        ·订单·
|       └---service.js      ·售后服务·
|       └---store.js        ·产品·
|       └---user.js ： 
|       └---wechat.js 
|   └---db
|       └---db.sql          表结构
|   └---middlewares         中间件
|       └---admin.js
|       └---base64Img.js    前端传入base64数据格式，转化为图片
|       └---check.js        检查用户session
|       └---index.js 
|       └---sign.js
|       └---user.js
|       └---wechat.js
|   └---proxy  代理操作dao
|       └---admin.js
|       └---config.js
|       └---index.js
|       └---oreder.js
|       └---user.js
|       └---wxSDK.js
|   └---public   静态资源目录
|   └---routers   路由控制
|   └---service 
|       └---wechat.js
|   └---utils 
|       └---apiclient_cert.p12    微信退款密钥文件
|       └---backage.jpg           我要推广背景图片
|       └---mysql.js              封装操作mysql
|       └---pay.js                调用微信支付API
|       └---qr.js                 生成个人推广二维码
|       └---sms.js                封装阿里云短信服务API
|       └---store.js 
|       └---tools.js              调用微信网页开发API
|       └---user.js
|       └---wechat.js
|       └---xml.js                封装xml和json互相转换
|---views    存放视图
|---config    配置文件
|---logs    存放log4js的文件
|---node_modules    依赖文件
|---utils
|   └--log.js   封装log4js写入文件
|---app.js    入口文件
|---controller.js    路由
|---Store.js    存储session 到redis
```

2.2.创建数据库和表结构:
表结构文件在`` ecough/app/db/db.sql ``

3.下载中控服务器代码：
用来存储微信access_token，access_token是公众号的全局唯一票据，公众号调用各接口时都需使用access_token。正常情况下access_token有效期为7200秒，重复获取将导致上次获取的access_token失效。
`` git clone https://github.com/autumnQH/wt.git ``
`` cd wt ``
`` npm i ``

3.1.目录结构
```
|wt
|---db
|   └---db.sql  表结构
|---app.js 
|---config.js   配置文件
|---tools.js   封装获取Access_token 和ticket 代码
```

3.2.创建数据库和表结构:
表结构文件在`` wt/db/db.sql ``

# 启动服务
请确保mysql redis 服务已经启动
启动前先把 `` wt/config.js ``相关配置修改成自己的.
启动前先把 `` ecough/app/config/config.js ``修改成自己的.
`` cd wt  ``
`` pm2 start app.js -n middle``
`` cd ecough ``
`` pm2 start app.js -n app ``

## 配置Nginx
`` vim /etc/nginx/nginx.conf ``
修改相关配置，大致如下：
```
......
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  www.baidu.com;
        # return      301 https://$server_name$request_uri; #强制https
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection ‘upgrade’;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
......    
```
重新加载配置文件
`` nginx -s reload ``
## 修改配置
### 微信后台配置
服务器地址: `你的域名` + `/wx`
### 账号密码
1.登录``域名/admin/config``修改相关配置
账号： root
密码： root666888
# OK


