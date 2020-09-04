var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var jwt = require('jsonwebtoken')

var appointRouter = require('./routes/appointment')
var usersRouter = require('./routes/users')
var meetingRoomRouter = require('./routes/meetingRoom')
var notificationRouter = require('./routes/notification')

var app = express()

/**
 * mongodb数据库连接配置文件
 */
const { mongoDB_USER_STR } = require('./config/mongodbConfig')

/**
 * 连接云端数据库
 */
const mongoose = require('mongoose')

// 连接 MongoDB 数据库
mongoose.connect(
	mongoDB_USER_STR,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log('连接MongoDB成功')
)
const mongoDB = mongoose.connection
mongoDB.on('error', console.error)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//解决跨域问题
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	if (req.method == 'OPTIONS') {
		//让options请求快速返回
		//options请求是“非简单请求”，请求之前会发送options预检请求
		res.sendStatus(200)
	} else {
		next()
	}
})

//请求接口时需要token，白名单的接口不需要token
app.all('*', function (req, res, next) {
	let method = req.method.toLowerCase() //获取请求方式，并打印成小写
	let path = req.path //获取当前请求路径
	console.log(path)
	if (whiteListUrl[method] && hasOneOf(path, whiteListUrl[method])) {
		//过滤，白名单的不需要接口认证
		next()
	} else {
		const token = req.headers.authorization
		if (!token) {
			res.status(401).send('there is no token, please login')
		} else {
			//token验证函数，验证token是否有效
			jwt.verify(token, 'abcd', (error, decode) => {
				if (error) {
					res.send({
						code: 401,
						mes: 'token error',
						data: {},
					})
				} else {
					//将请求对象中的userName属性设置值
					req.userName = decode.name
					next()
				}
			})
		}
	}
})

app.use('/users', usersRouter)
app.use('/appointment', appointRouter)
app.use('/meetingRoom', meetingRoomRouter)
app.use('/notification', notificationRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
})

//设置的白名单接口列表
const whiteListUrl = {
	get: ['/getUserInfo', '/users/getUserEmail/', '/users/queryUserList'],
	post: ['/users/login/', '/users/register/', '/users/getUserEmail/'],
	options: ['/users/login/', '/users/register/', '/users/getUserEmail/'],
}
const hasOneOf = (str, arr) => {
	return arr.some((item) => item.includes(str))
}

module.exports = app
