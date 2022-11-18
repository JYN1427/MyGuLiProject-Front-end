'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // 访问的后端接口的地址：
  BASE_API: '"http://localhost:9001"',  // nginx地址
})
