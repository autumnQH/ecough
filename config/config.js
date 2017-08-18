const config = {
  app: {
     name: "ecough",
     version: "1.0",
  },
  
  server: {
    port: 80
  },

  ecough: {
    wx: {
      appid: 'wxff24c10734aed1ef',
      appSecret: 'e4f2067a90f7aed463e6bc51ba02f51d',
      token: 'ecough',
      encodingAESKey: 'FWLsqciavqqVROWeWHsyt5p10z76b0ovIs6oEevXuL2'
    },

    db: {
      host: 'localhost',
      port:  '3306',
      name: 'ecough',
      user: 'root',
      passwd: 'root',
      conn_limit: 5
    },
  }

}

module.exports = Object.assign({}, config);
