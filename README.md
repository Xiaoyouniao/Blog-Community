# Blog - Community

## 起步

- 项目初始化，确定技术栈(Nodejs/Express/mongoose)  
- 模板处理 (express-art-template)
- 路由搭建(body-parser)

## 路由设计

| 请求方法 | 请求路径          | get 参数 | post 参数                        | 备注             |
| -------- | ----------------- | -------- | -------------------------------- | ---------------- |
| GET      | /                 | 无       | —                                | 渲染首页         |
| GET      | /login            | 无       | —                                | 渲染登录页       |
| POST     | /login            | —        | email、password                  | 处理登录请求     |
| GET      | /register         | 无       | —                                | 渲染注册页面     |
| POST     | /register         | —        | email、password、nickname        | 处理注册请求     |
| GET      | /logout           | 无       | —                                | 处理退出登录请求 |
| GET      | /home             | 无       | —                                | 渲染个人主页     |
| GET      | /settings/profile | 无       | —                                | 渲染个人设置页面 |
| POST     | /settings/profile | —        | email、nickname、profile、gender | 处理个人设置请求 |
| GET      | /settings/admin   | 无       | —                                | 渲染修改密码页面 |
| POST     | /settings/admin   | —        | oldpassword、newpassword         | 处理修改密码请求 |
| GET      | /settings/remove  | 无       | —                                | 删除个人账户     |
| GET      | /topics/new       | 无       | —                                | 渲染发起话题页面 |
| POST     | /topics/new       | —        | model、title、content            | 处理发表话题请求 |
| GET      | /topics/edit      | 无       | —                                | 渲染编辑话题页面 |
| POST     | /topics/edit      | —        | model、title、content、          | 处理编辑话题请求 |
| GET      | /topic/remove     | 无       | —                                | 删除话题         |

## 编写入口文件

- 配置express、body-parser，配置静态资源，导入路由文件，监听端口

## 编写数据处理文件

- 创建连接，连接 Mongoose 数据库
  - users
  - topics
  - comments
- 调用 mongoose 相关 API 操作数据库，完成增、删、改、查