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
  },
  qrcode: {
    create: base + 'qrcode/create?'
  },
  customservice: {
    kfsession: {
      create: base + 'customservice/kfsession/create?',
    },
    getonlinekflist: base + 'customservice/getonlinekflist?'
  },
  message: {
    custom: {
      send: base + 'message/custom/send?'
    },
    template: {
      send: base + 'message/template/send?'
    }
  },
  template: {
    add: base + 'template/api_add_template?',
    fetch: base + 'template/get_all_private_template?'
  }
}

exports.sendTemplateMessage = (token, data) => {
  const url = `${api.message.template.send}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.getTemplateId = async () => {
  const { template_list } = await this.handle('fetchTemplateList')
  const isTemplateId = isValidTemplateId(template_list)
  if(isTemplateId) {
    return isTemplateId
  }
  const { template_id } = await this.handle('addTemplate') 
  return template_id  
}

exports.fetchTemplateList = (token) => {
  const url = `${api.template.fetch}access_token=${token}`
  return {url}
}

/**
 * 获得模板ID
 * return  {
     "errcode":0,
     "errmsg":"ok",
     "template_id":"Doclyl5uP7Aciu-qZ7mJNPtWkbkYnWBWVja26EGbNyk"  
   }
 */
exports.addTemplate = (token, data = {template_id_short: 'OPENTM200814444'}) => {
  const url = `${api.template.add}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.sendCustomMessage = (token, data) => {
  const url = `${api.message.custom.send}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.createKfsession = (token, openid, kf_account) => {
  const url = `${api.customservice.kfsession.create}access_token=${token}`
  const data = {openid, kf_account}
  return {url: url, method: 'POST', body: data}
}

exports.getTheFirstOnlineCustomerservice = (token)=> {
  const url = `${api.customservice.getonlinekflist}access_token=${token}`
  return {url}
}

exports.createQRCode = (token, data)=> {
  const url = `${api.qrcode.create}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.getSignatureAsync = async (url)=> {
  const data = await this.getTicket()
  return signature(data.ticket, url)
}

exports.deleteMenu = (token)=> {
  const url = `${api.menu.delete}access_token=${token}`
  return {url}
}

exports.createMenu = (token, menu)=> {
  const url = `${api.menu.create}access_token=${token}`
  return {method: 'POST', url: url, body: menu}
}

exports.remarkUser = (token, openid, remark)=> {
  const url = `${api.user.remark}access_token=${token}`
  const form = {openid, remark}
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
    method: 'GET',
    json: true
	}
	const opts = Object.assign(opt, options)
	return new Promise((resolve, reject) =>{
    Request(opts, function(err, res, body) {
      if(body){
        return resolve(body);
      }else{
        console.error(err)
        return reject(err);
      }
    });
	})
}

exports.updateTicket = async (token)=> {
  const url = `${api.ticket}access_token=${token}&type=jsapi`
  const data = await this.request({url})
  const now = (new Date().getTime())
  const expiresIn = now + (data.expires_in - 60) * 1000
  data.expires_in = expiresIn

  return data   
}

exports.getTicket = async ()=> {
  let data = await wechat.fetchTicket();
  if (!this.isValidToken(data, 'ticket')) {
    const token = await this.getAccessToken()
    data = await this.updateTicket(token.access_token)
    if(data.errmsg !== 'ok') {
      return {}
    }
    delete data.errcode
    delete data.errmsg
    await wechat.saveTicket(data)
  }
  return data
}

exports.updateAccessToken = async ()=> {
	const config = await Config.getConfig()
  const url = api.accessToken + '&appid=' + config.appid + '&secret=' + config.appSecret

  const data = await this.request({url: url})
  const now = (new Date().getTime())
  const expiresIn = now + (data.expires_in - 60) * 1000

  data.expires_in = expiresIn

  return data	
}

exports.getAccessToken = async ()=> {
	let data = await wechat.fetchToken();
  if (!this.isValidToken(data, 'access_token')) {
    data = await this.updateAccessToken()
    if(data.errcode) {
      return {}
    }
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

function isValidTemplateId(data) {
  let id = null
  data.forEach(item => {
    if(item.title === '购买成功通知') {
      id = item.template_id
    }
  })
  return id
}
