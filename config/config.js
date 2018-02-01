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
      appid: 'wxc25f48089fba29f3',
      appSecret: '328f39d113a5e31d58b0fb20cdccb4c7',
      // getGiftForConsumeByNameAndSpecifications
      token: 'ecough'
      //,encodingAESKey: 'FWLsqciavqqVROWeWHsyt5p10z76b0ovIs6oEevXuL2'
    },

    db: {
      host: 'localhost',
      //port:  '3306',
      name: 'ecough',
      user: 'root',
      passwd: '450450',
      conn_limit: 5
    },
  }

}

module.exports = Object.assign({}, config);
