/**
 * 用户登录接口
 */
var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')
const userInfo = require('../models/userInfo')

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource')
})

router.get('/getUserInfo', function (req, res, next) {
	//const userName = req.body.userName
	const { userName, email } = req.body.userInfo
	//调用数据库查询方法，查询
	userInfo.findOne(
		{
			userName,
			email,
		},
		function (err, user) {
			if (err) {
				res.status(401).send({
					mes: '获取用户信息失败',
					code: 401,
					user: null,
				})
			} else {
				res.status(200).send({
					mes: '获取信息成功',
					code: 200,
					user: user,
				})
			}
		}
	)
})

router.post('/register', function (req, res, next) {
	const { userName, email, password } = req.body
	console.log(req)
	// return res.status(200).send({
	// 	mes: '接口调用成功',
	// 	code: 200,
	// })
	//调用数据库查询方法，查询
	const user = new userInfo({
		userName,
		email,
		password,
	})
	//首先执行邮箱信息查找，如果找到信息了，则说明该邮箱已经注册过了
	userInfo.findOne({ email }).then((result) => {
		if (result) {
			return res.json({
				msg: '该邮箱已经被注册了，请重新填写其他邮箱，或找回账号',
				code: 400,
			})
		} else {
			userInfo.create(user, (err, response) => {
				if (err) {
					res.send({
						code: 401,
						mes: '用户注册失败，请重新填写信息注册',
					})
				} else {
					console.log('用户数据插入成功' + response)
					res.status(200).send({
						code: 200,
						mes: '用户注册成功, 请返回登录页登录',
					})
				}
			})
		}
	})
})

router.post('/login', async function (req, res, next) {
	const { userName, password, email } = req.body
	if (userName) {
		const userInfo = await getPasswordByNameAndEmail(req.body)
		if (!password || userInfo !== password) {
			res.send({
				code: 401,
				mes: '账号密码不匹配',
				data: {},
			})
		} else {
			res.send({
				code: 200,
				mes: 'success',
				data: {
					token: jwt.sign({ name: userName }, 'abcd', {
						expiresIn: '2h',
					}),
				},
			})
		}
	} else {
		res.status(401).send({
			code: 401,
			mes: 'user name is empty',
			data: {},
		})
	}
})

/**
 * 校验接口，当请求信息通过了验证，则req.userName中是有值的
 * 所以可以进行后续的操作了
 */
router.get('/authorization', (req, res, next) => {
	const userName = req.userName
	res.send({
		code: 200,
		mes: 'success',
		data: {
			token: jwt.sign({ name: userName }, 'abcd', {
				expiresIn: '2h',
			}),
		},
	})
})

/**
 * 通过用户名，获取用户邮箱接口
 */
router.get('/getUserEmail', function (req, res, next) {
	getEmailByName(req.query.userName)
		.then((email) => {
			res.status(200).send({
				mes: 'success',
				code: 200,
				data: {
					email,
				},
			})
		})
		.catch((e) => {
			res.status(400).send({
				mes: e,
				code: 400,
				data: {
					email: null,
				},
			})
		})
})

/**
 * 获取用户邮箱接口
 * @param {string} userName
 */
async function getEmailByName(userName) {
	return new Promise((resolve, reject) => {
		userInfo
			.findOne({
				userName: userName,
			})
			.then((result) => {
				if (result) {
					resolve(result.email)
				} else {
					reject(false)
				}
			})
	})
}

async function getPasswordByNameAndEmail({ userName, email }) {
	return new Promise((resolve, reject) => {
		userInfo
			.findOne({
				userName: userName,
			})
			.then((result) => {
				console.log(result)
				resolve(result.password)
			})
			.catch((e) => {
				console.log(e)
				resolve(null)
			})
	})
}

/**
 * 查询当前登录用户的权限
 */

router.get('/queryUserRole', (req, res, next) => {
	const userName = req.query.userName
	queryUserRole(userName)
		.then((role) => {
			res.send({
				code: 200,
				data: role,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
async function queryUserRole(userName) {
	return new Promise((resolve, reject) => {
		userInfo.findOne(
			{
				userName,
			},
			(err, result) => {
				if (err) reject(false)
				else {
					const role = result.role
					resolve(role)
				}
			}
		)
	})
}

/**
 * 获取用户列表接口
 */
router.get('/queryUserList', (req, res, next) => {
	const group = req.query.group
	queryUserList(group)
		.then((userList) => {
			res.send({
				code: 200,
				data: userList,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
async function queryUserList(group) {
	group ? group : null
	return new Promise((resolve, reject) => {
		userInfo.find(group, (err, data) => {
			if (err) reject(err)
			else {
				resolve(data)
			}
		})
	})
}

module.exports = router
