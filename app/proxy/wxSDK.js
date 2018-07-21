const wechat= require('../dao/wechat');
const Config = require('../proxy').Config;
const { signature } = require('../utils/wechat-lib')
const Request = require('request');

const base = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
	accessToken: base + 'token?grant_type=client_credential',
  ticket: base + 'ticket/getticket?',
  user: {
    info: base + 'user/info?',
    remark: base + 'user/info/updateremark?'
  },
  menu: {
    create: base + 'menu/create?',
    delete: base + 'menu/delete?'
  }  
}

exports.getSignatureAsync = async (url)=> {
  console.log('getSignatureAsync')
  const data = await this.getTicket()
  return signature(data.ticket, url)
}

exports.deleteMenu = (token)=> {
  console.log('deleteMenu')
  const url = `${api.menu.delete}access_token=${token}`

  return {url}
}

exports.createMenu = (token, menu)=> {
  console.log('createMenu')
  const url = `${api.menu.create}access_token=${token}`

  return {method: 'POST', url: url, body: menu}
}

exports.remarkUser = (token, openid, remark)=> {
  const url = `${api.user.remark}access_token=${token}`
  const form = JSON.stringify({openid, remark})
  return {method: 'POST', url: url, body: form}
}

exports.fetchUserInfo = (token, openid, lang='zh_CN') => {
  const url = `${api.user.info}access_token=${token}&openid=${openid}&lang=${lang}`
  return {url}
}

exports.handle = async (operation, ...args)=> {
  const tokenData = await this.getAccessToken()
  const options = this[operation](tokenData.access_token, ...args)
  const data = await this.request(options)
  return data
}

exports.request = (options)=> {
	let opt = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'GET'
	}
	const opts = Object.assign(opt, options)
	return new Promise((resolve, reject) =>{
    Request(opts, function(err, res, body) {
      if(body){
        return resolve(JSON.parse(body));
      }else{
        console.error(err)
        return reject(err);
      }
    });
	})
}

exports.updateTicket = async (token)=> {
  console.log('updateTicket')
  const url = `${api.ticket}access_token=${token}&type=jsapi`
  const data = await this.request({url})
  const now = (new Date().getTime())
  const expiresIn = now + (data.expires_in - 60) * 1000
  data.expires_in = expiresIn

  return data   
}

exports.getTicket = async ()=> {
  console.log('getTicket')
  let data = await wechat.fetchTicket();
  if (!this.isValidToken(data, 'ticket')) {
    const token = await this.getAccessToken()
    data = await this.updateTicket(token.access_token)
    delete data.errcode
    delete data.errmsg
    await wechat.saveTicket(data)
  }
  console.log('!!!!')
  return data
}

exports.updateAccessToken = async ()=> {
  console.log('updateAccessToken')
	const config = await Config.getConfig()
  const url = api.accessToken + '&appid=' + config.appid + '&secret=' + config.appSecret

  const data = await this.request({url: url})
  const now = (new Date().getTime())
  const expiresIn = now + (data.expires_in - 60) * 1000

  data.expires_in = expiresIn

  return data	
}

exports.getAccessToken = async ()=> {
  console.log('getAccessToken')
	let data = await wechat.fetchToken();
  if (!this.isValidToken(data, 'access_token')) {
    data = await this.updateAccessToken()
    await wechat.saveToken(data)
  }
	return data
}

exports.isValidToken = (data, name)=> {
  if (!data || !data[name] || !data.expires_in) {
    return false
  } 

  const expiresIn = data.expires_in
  const now = (new Date().getTime())

  if (now < expiresIn) {
    return true
  } else {
    return false
  }    
}
