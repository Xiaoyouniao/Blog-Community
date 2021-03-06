var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/dalei', { useMongoClient: true })

var Schema = mongoose.Schema

var userSchema = new Schema({
    // 创建数据库结构
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    created_time: {
        type: Date,
        // 注意：这里不要写 Date.now() 因为会即刻调用
        // 这里直接给了一个方法：Date.now
        // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-default.jpg'
    },
    birthday: {
        type: Date
    },
    profile: {
        type: String,
        default: '这个人很懒，什么都没有留下'
    }
})

module.exports = mongoose.model('User', userSchema)