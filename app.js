let express = require('express')
let router = require('./router')
let session = require('express-session')
let bodyParser = require('body-parser')
let app = express()
let ejs = require('ejs')

app.set("view engine","ejs")    //使用 ejs 模板引擎
// app.engine('html',ejs.renderFile)   //为html扩展名注册ejs

app.use('/public/',express.static('./public/'))
app.use('/node_modules/',express.static('./node_modules/'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(session({
    secret: 'user', //用来对session cookie 签名，防止篡改
    resave: false,  //强制保存session即使没有变化
    saveUninitialized: false    //强制将未初始化的session存储
}))
app.use(router)
app.listen(3000,()=>{
    console.log('Running....')
})