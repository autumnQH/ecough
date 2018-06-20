const config = {
  server: {
    port: 3000 // 程序端口号
  },
  SITE_ROOT_URL: 'https://www.fafuna.cn', // 程序启动时，创建微信菜单的url
  db: {
    host: '10.66.218.107',
    // host: 'localhost',
    //port:  '3306',
    database: 'ecough',
    user: 'root',
    password: 'Root123456==',
    // password: '450450',
    conn_limit: 5,
    // 'charset': config.db.charset,
    'supportBigNumbers': true,
    'bigNumberStrings': true    
  }

}

module.exports = Object.assign({}, config);
