const config = {
  server: {
    port: 80 // 程序端口号,不用修改
  },
  SITE_ROOT_URL: 'http://www.fafuna.cn',// http://www.fafuna.cn //http://fafuna.vipgz1.idcfengye.com
  db: {
    host: '10.66.218.107', // ip地址 10.66.218.107
    port:  '3306', 
    database: 'ecough', 
    user: 'root', 
    password: 'Root123456==' // Root123456==
  }
}

module.exports = Object.assign({}, config);
