const xml2js = require('xml2js')

exports.xmlToJson = (xml) => {
     return new Promise((resolve, reject) => {
        const parseString = xml2js.parseString
        parseString(xml, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
     })
}

exports.jsonToXml = (obj) => {
    const builder = new xml2js.Builder()
    return builder.buildObject(obj)
}

