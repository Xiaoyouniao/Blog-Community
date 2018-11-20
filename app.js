/**
 * 项目入口文件
 * 功能分析
 *    构建项目所需服务框架（express-art-template/body-parser/express-session）
 *    监听端口
 */

var express = require('express')
var router = require('./router')
var path = require('path')
var session = require('express-session')
var bodyParser = require('body-parser')

var app = express()

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))

// 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
// 目的是为了增加安全性，防止客户端恶意伪造
app.use(session({
    secret: 'dalei',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))

app.use(router)

// 配置一个处理 404 的中间件
app.use(function(req, res) {
    res.render('404.html')
})

// 配置一个全局错误处理中间件
app.use(function(err, req, res, next) {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.engine('html', require('express-art-template'))

app.listen(3001, () => {
    console.log('Server is running on port 3001...')
})