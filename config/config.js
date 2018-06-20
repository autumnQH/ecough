const config = {
  server: {
    port: 3000 // 程序端口号
  },
  SITE_ROOT_URL: 'https://www.fafuna.cn', // 程序启动时，创建微信菜单的url
  //数据库连接配置选项
  db: {
    host: '10.66.218.107', // ip地址
    // host: 'localhost',
    //port:  '3306', // 默认端口
    database: 'ecough', // 链接指定数据库
    user: 'root', // 登录数据库账号
    password: 'Root123456==', // 登录数据库密码
    // password: '450450',
    // conn_limit: 5, // 链接池
    // 'charset': // The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci). If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used. (Default: 'UTF8_GENERAL_CI')
    'supportBigNumbers': true,// but leaving bigNumberStrings disabled will return big numbers as String objects only when they cannot be accurately represented with [JavaScript Number objects] (http://ecma262-5.com/ELS5_HTML.htm#Section_8.5) (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled.
    'bigNumberStrings': true //Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects (Default: false). Enabling 
  }

}

module.exports = Object.assign({}, config);
