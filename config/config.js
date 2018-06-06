const config = {
  app: {
     name: "ecough",
     version: "1.0",
  },
  server: {
    port: 80
  },
  SITE_ROOT_URL: 'https://www.fafuna.cn',
  db: {
    host: '10.66.218.107',
    // host: 'localhost',
    //port:  '3306',
    database: 'ecough',
    user: 'root',
    password: 'Root123456==',
    // password: '450450',
    conn_limit: 5
  }

}

module.exports = Object.assign({}, config);
