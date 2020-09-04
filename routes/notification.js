/**
 * 用户登录接口
 */
var express = require('express')
var router = express.Router()
const notification = require('../models/notification')

/**
 * 创建通知信息
 */
router.post('/createNotification', (req, res, next) => {
	const obj = new notification(req.body)

	cerateNotification(obj)
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((e) => {
			res.send({
				code: 200,
				data: e,
			})
		})
})
async function cerateNotification(obj) {
	return new Promise((resolve, reject) => {
		notification.create(obj, (err, data) => {
			if (err) reject('创建通知时发生错误，请检查输入参数是否合规')
			else {
				resolve(data)
			}
		})
	})
}
module.exports = router
