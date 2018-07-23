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
  console.log('sendTemplateMessage')
  const url = `${api.message.template.send}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.getTemplateId = async () => {
  console.log('getTemplateId')
  const data = await this.handle('fetchTemplateList')
  console.log(data,'data-----------')
  const { template_list } = data
  console.log(template_list)
  console.log('template_list---------',template_list)
  if(data) {
    if(template_list.length > 0 && template_list[0].title === '购买成功通知') {
      console.log('template_list[0].template_id -------', template_list[0].template_id, '====')
      template_list.forEach(item => {
        if(item.title === '购买成功通知'){
          return item.template_id
        }
      })
    }
  }else {
    const { template_id } =  await this.handle('addTemplate')
    console.log('template_id==========', template_id, 'add!!!!!')
    return template_id
  }
}

exports.fetchTemplateList = (token) => {
  console.log('fetchTemplateList')
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
  console.log('addTemplate')
  const url = `${api.template.add}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.sendCustomMessage = (token, data) => {
  console.log('sendCustomMessage')
  const url = `${api.message.custom.send}access_token=${token}`
  return {url: url, method: 'POST', body: data}
}

exports.createKfsession = (token, openid, kf_account) => {
  console.log('createKfsession')
  const url = `${api.customservice.kfsession.create}access_token=${token}`
  const data = {openid, kf_account}
  return {url: url, method: 'POST', body: data}
}

exports.getTheFirstOnlineCustomerservice = (token)=> {
  console.log('getTheFirstOnlineCustomerservice')
  const url = `${api.customservice.getonlinekflist}access_token=${token}`
  return {url}
}

exports.createQRCode = (token, data)=> {
  console.log('createQRCode')
  const url = `${api.qrcode.create}access_token=${token}`
  return {url: url, method: 'POST', body: data}
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
    if(data.errmsg !== 'ok') {
      return {}
    }
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
