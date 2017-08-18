const config = {
    wx: {
      appid: 'wxff24c10734aed1ef',
      appSecret: 'e4f2067a90f7aed463e6bc51ba02f51d',
      token: 'ecough',
      encodingAESKey: '9dq7tO5Gi7iP6tIiCUBUXM55eVG8CGCWuRS2zyk5CPS',
      message: {
        text: "终于等到您，还好没放弃！",
        default: "冥冥之中自有缘分！" 
      }
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

module.exports = Object.assign({}, config);
