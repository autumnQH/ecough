const env = process.env.NODE_ENV || 'development'
console.log(process.env.NODE_ENV,'process.env.NODE_ENV')

module.exports = Object.assign({}, require(`./${env}`));
