var json = {
  product_id: 10001,
  title: '防雾霾窗贴',
  keywords: '防雾霾窗贴',
  description: '防雾霾窗贴',
  centent: '防雾霾窗贴',
  name: '防雾霾窗贴',
  sku_attr: '白色,黑色',
  sku_info: '1.3米:15:20:1000:001,1.0米:10:15:1000:002',
  icon_url: '\'www.baidu.com\'',
  icon_url_opt: '\'\'',
  isPostFree: 1,
  isHasReceipt: 0,
  isUnderGuaranty: 0,
  isSupportReplace: 0 };
	json.sku_attr = json.sku_attr.split(',');
	json.sku_info = json.sku_info.split(',').map(function(val, index, arr) {
		var newarr = val.split(':');
		return {specifications: newarr[0], price: newarr[1], ori_price: newarr[2], repertory: newarr[3], qr: newarr[4]}; 
	});


console.log(json);

var json2 = {
  product_id: 10001,
  title: '防雾霾窗贴',
  keywords: '防雾霾窗贴',
  description: '防雾霾窗贴',
  centent: '防雾霾窗贴',
  name: '防雾霾窗贴',
  sku_attr: '白色,黑色',
  sku_info: '1.3米:15:20:1000:001,1.0米:10:15:1000:002',
  icon_url: '\'www.baidu.com\'',
  icon_url_opt: '\'\'',
  isPostFree: 1,
  isHasReceipt: 0,
  isUnderGuaranty: 0,
  isSupportReplace: 0 }