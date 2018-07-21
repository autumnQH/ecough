const env = process.env.NODE_ENV || 'development'

console.log(process.env.NODE_ENV)
console.log(typeof process.env.NODE_ENV)

module.exports = Object.assign({}, require(`./${env}`));
