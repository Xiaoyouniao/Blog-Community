/**
 * 路由模块
 *    配置项目所需路由
 */

var express = require('express')
var router = express.Router()
var User = require('./models/user')
var Topic = require('./models/topic')
var md5 = require('blueimp-md5')

router.get('/', (req, res) => { // 渲染首页
    // 判断 req.session.user 是否存在，根据结果渲染网页登录/设置部分
    res.render('index.html', {
        user: req.session.user
    })
}).get('/login', (req, res) => { // 渲染登录页
    res.render('login.html')
}).post('/login', (req, res) => { // 登录页提交
    /**
     * 1. 获取表单数据
     * 2. 查询数据库用户名密码是否正确
     * 3. 发送响应数据
     */

    var body = req.body

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(200).json({
            err_code: 1,
            message: 'Email or password is invalid'
        })

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })

}).get('/register', (req, res) => { // 渲染注册页
    res.render('register.html')
}).post('/register', (req, res) => { // 注册页提交

    var body = req.body
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, (err, user) => {
        if (err) {
            return next(err)
        }
        if (user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname already exists'
            })
            return res.send('邮箱或密码已存在，请重置')
        }

        body.password = md5(md5(body.password))

        req.session.user = body

        new User(body).save((err, user) => {
            if (err) return next(err)
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })

        })

    })
}).get('/logout', (req, res) => { // 退出登录
    req.session.user = null

    res.redirect('/login')
}).get('/home', (req, res) => { // 进入个人主页页面
    // 获取相关数据
    // 渲染个人主页

    User.findOne({ nickname: req.session.user.nickname }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })

        Topic.find({ author: req.session.user.nickname }, (err, topic) => {
            if (err) return next(err)
            if (topic.length == 0) return res.status(200).json({
                err_code: 2,
                message: 'DataBase Error'
            })


            res.render('homepage.html', {
                user: user,
                topic: topic
            })

        })

    })


}).get('/settings/profile', (req, res) => { // 进入设置页面
    // 获取相关数据
    // 渲染个人主页
    User.findOne({ nickname: req.session.user.nickname }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })

        res.render('settings/profile.html', {
            user: req.session.user
        })
    })
}).post('/settings/profile', (req, res) => { // 提交修改结果
    // 1. 获取表单提交的信息
    // 2. 连接数据库，更新数据库中数据
    // 3. 切换页面

    User.findOneAndUpdate({ email: req.session.user.email }, req.body, {
        new: true,
        upsert: false

    }, (err, data) => {
        if (err) return next(err)
        if (!data) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })
        req.session.user = data

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}).get('/settings/admin', (req, res) => { // 进入修改密码页面
    // 获取相关数据
    // 渲染个人主页

    User.findOne({ nickname: req.session.user.nickname }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })

        res.render('settings/admin.html', {
            user: req.session.user
        })
    })
}).post('/settings/admin', (req, res) => { // 提交修改密码结果
    // 获取表单提交信息
    // 连接数据库，更新数据库
    // 切换页面

    if (md5(md5(req.body.oldpassword)) != req.session.user.password) {
        // console.log('密码错误')
        return res.status(200).json({
            err_code: 3,
            message: 'Password Error'
        })
    }

    User.findOneAndUpdate({
        email: req.session.user.email
    }, {
        password: md5(md5(req.body.newpassword))
    }, {
        new: true,
        upsert: false
    }, (err, data) => {

        if (err) return next(err)
        if (!data) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })
        req.session.user = data

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })

    })
}).get('/settings/remove', (req, res) => {
    User.findOneAndRemove({ email: req.session.user.email }, (err) => {

        if (err) return res.status(200).json({
            err_code: 2,
            message: 'DateBase Error'
        })

        req.session.user = null

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}).get('/topics/new', (req, res) => {
    // 获取相关数据
    // 渲染个人主页
    User.findOne({ nickname: req.session.user.nickname }, (err, user) => {
        if (err) return next(err)
        if (!user) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })

        res.render('topic/new.html', {
            user: req.session.user
        })
    })
}).post('/topics/new', (req, res) => {

    var body = req.body
    body.author = req.session.user.nickname

    new Topic(body).save((err, topic) => {

        if (err) return next(err)

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })

    })

}).get('/topics/edit', (req, res) => {

    var id = req.query.id.replace(/"/g, '')

    Topic.findOne({ _id: id }, (err, topic) => {
        if (err) return next(err)
        if (!topic) return res.status(200).json({
            err_code: 1,
            message: 'Topic does not exist'
        })

        req.session.topicId = id

        res.render('topic/edit.html', {
            user: req.session.user,
            topic: topic
        })
    })

}).post('/topics/edit', (req, res) => {

    var id = req.session.topicId
    var body = req.body


    Topic.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        upsert: false
    }, (err, topic) => {
        if (err) return next(err)
        if (!topic) return res.status(200).json({
            err_code: 2,
            message: 'DataBase Error'
        })
        console.log(topic)

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })

}).get('/topic/remove', (req, res) => {
    var id = req.query.id.replace(/"/g, '')

    Topic.findOneAndRemove({ _id: id }, (err) => {

        if (err) return res.status(200).json({
            err_code: 2,
            message: 'DateBase Error'
        })
    })
    res.redirect('/home')
})


// topic/edit.html => 编辑话题
// topic/new.html => 新建话题
// topic/show.html => 发表话题
module.exports = router