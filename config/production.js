module.exports = {
  server: {
    port: 80 // 程序端口号,不用修改
  },
  SITE_ROOT_URL: 'http://www.fafuna.cn',
  db: {
    host: '10.66.218.107', // ip地址 10.66.218.107
    port:  '3306', 
    database: 'ecough', 
    user: 'root', 
    password: 'Root123456==' // Root123456==
    ,conn_limit: 5
  }  
}
