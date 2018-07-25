const xml = require('../utils/xml');
const tools = require('../utils/tools');
const urlencode = require('urlencode');
const Store = require('../proxy').Store
const Config = require('../proxy').Config;

exports.getProductById = async (ctx, next) => {
  try{
    const config = await Config.getConfig();
    const product_id = ctx.params.product;
    const store = await Store.getStoreById(product_id);
    await ctx.render('product', {
      url: config.server_host,
      store: store
    });       
  }catch(e) {
    console.error(e)
  }
}
