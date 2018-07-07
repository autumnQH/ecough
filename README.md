[TOC]
# 环境要求

> Linux(CentOS 7.2): 自由和开放源码的类UNIX操作系统。
> NodeJS(version 8.9): Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
> Nginx(version 1.12.2): 轻量级网页服务器、反向代理服务器。
> Mysql(version 5.6): 关系型数据库管理系统。
> Redis(version 3.6):内存存储的数据结构服务器，可用作数据库，高速缓存和消息队列代理。

## 环境准备
### 服务器（CentOS7.2）
购买链接 https://cloud.tencent.com/product/cvm
#### 第一步：点击立即选购
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.01.05.png)

#### 第二步：选择镜像，购买
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.03.50.png)

#### 第三步：进入控制台
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.09.43.png)

#### 第四步：选择云产品，云服务器
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.50.28.png)

#### 第五步：选择云主机并关机
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.22.09.png)

#### 第六步：选择ssh密钥
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.15.07.png)

#### 第七步：创建密钥
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.16.40.png)

#### 第八步：下载密钥
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.17.58.png)

#### 第九步：选择刚才创建的密钥并绑定云主机
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.25.16.png)

#### 第十步：选择安全组并点击新建,选择：放通22，80，443，3389端口和ICMP协议
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.27.34.png)

#### 第十一步：选择云主机点击更多，配置安全组
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.30.05.png)

#### 第十二步：选择安全组
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.31.41.png)

#### 第十三步:购买mysql数据库。选择云产品，关系型数据库
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.52.17.png)

#### 第十四步: 新建
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.53.24.png)

#### 第十五步: 购买
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.53.24.png)

#### 第十六步: 管理mysql
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.59.25.png)

#### 第十七步: 创建账号密码
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.00.52.png)

#### 第十八步: 数据库导入
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.05.35.png)

#### 第十九步: 下载源代码到本地。代码地址（https://github.com/autumnQH/ecough）
然后选择``ecough/app/db/db.sql``文件并上传
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.06.22.png)

#### 第二十步：选择云产品，云服务器。开机，并登录
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.33.56.png)

#### 第二十一步：选择第八步下载的文件
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.36.04.png)

#### 第二十二步：进入服务器
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%885.40.32.png)

#### 第二十三步：在服务器下输入下面命令
##### 1.nodejs 安装
`` wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3.tar.gz ``
`` tar -zxvf node-v8.9.3.tar.gz ``
`` cd node-v8.9.3 ``
`` ./configure --prefix=/usr/local/node ``
``  make && make install ``
`` node -v ``
`` npm -v ``
`` npm i -g pm2 ``

##### 2.Nginx 安装
`` yum install nginx ``
`` service nginx restart ``
`` wget http://127.0.0.1 ``

##### 3.下载项目源代码
`` git clone https://github.com/autumnQH/ecough.git ``
`` cd ecough ``
`` npm i ``

##### 4.下载中控服务器代码：
`` git clone https://github.com/autumnQH/wt.git ``
`` cd wt ``
`` npm i ``

##### 5.获取Mysql IP 地址
![iamge](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.32.44.png)

##### 6.获取云服务器 IP地址， 获取公网IP
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.43.14.png)

##### 7.登录微信公众号获取微信AppId,appSecret
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%887.13.08.png)

##### 8.修改相关配置，没说明的就不用修改
###### 8.1 打开`` wt``文件夹下``config.js``文件，相关配置修改成自己的.
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%887.19.07.png)

###### 8.2 打开`` ecough/config/``文件夹下``config.js ``文件，相关配置修改成自己的
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%887.21.39.png)

##### 9.启动服务
`` cd wt  ``
`` pm2 start app.js -n middle``
`` cd ecough ``
`` pm2 start app.js -n app ``

##### 10.配置Nginx
`` vim /etc/nginx/nginx.conf ``
修改相关配置，大致如下：
```
......
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  www.baidu.com #你的域名 如www.baidu.com;
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
`service nginx start `

#### 第二十四步：登录微信公众号后台，修改微信公众后台配置（重要）
##### 1.ip白名单，填写第 步获取的IP地址
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.45.37.png)

##### 2.填写第服务器地址: `你的域名` + `/wx`。如``www.ecough.cn/wx``
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.48.52.png)

##### 3.修改公众号功能设置
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.56.34.png)

##### 4.下载MP_verify_0Ula6xjDfEiNpXFD.txt文件并放到``ecoug/app/public``目录下

##### 5.登录微信支付商户后台, 获取证书，密钥，商户号。并下载证书放到 `ecough/app/utils/`目录下
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%886.54.22.png)
#### 第二十五步：获取阿里云短信服务accessKeyId,secretAccessKey,短信签名，短信模版
登录阿里云网站https://www.aliyun.com 进入控制台,选择accesskey
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%888.10.48.png)
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%888.09.15.png)
##### 短信签名
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%888.12.08.png)
##### 短信模版CODE
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%888.13.15.png)

#### 第二十流步：本地打开浏览器
`你的域名/admin`并修改相关配置
账号： root
密码： root666888

根据前面步骤获取的微信公众号ID，微信支付密钥，阿里云短信服务填写
![image](http://p8p8yzlxl.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-06-21%20%E4%B8%8B%E5%8D%887.52.57.png)
# OK


