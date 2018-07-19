const config = {
  server: {
    port: 3000 // 程序端口号,不用修改
  },
  SITE_ROOT_URL: 'http://polite-husky-31.localtunnel.me',
  db: {
    host: '127.0.0.1', // ip地址 10.66.218.107
    port:  '3306', 
    database: 'ecough', 
    user: 'root', 
    password: '450450', // Root123456==
    supportBigNumbers: true,
    bigNumberStrings: true 
  }
}

module.exports = Object.assign({}, config);
