/**
 * 用户登录接口
 */
var express = require('express')
var router = express.Router()
const notification = require('../models/notification')
const qs = require('qs')

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

/**
 * 查询通知显示信息
 */
router.get('/queryNotification', (req, res, next) => {
	const { department, limit = 10, skip = 0, sort = 1 } = qs.parse(req.query)
	queryNotification(department, limit, skip, sort)
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
async function queryNotification(department, limit, skip, sort) {
	return new Promise((resolve, reject) => {
		let filter = {}
		if (department) {
			filter = {
				department: {
					departmentNumber: department,
				},
			}
		}

		notification
			.find(filter)
			.sort({
				_id: parseInt(sort),
			})
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.exec((err, result) => {
				if (err) reject(err)
				else {
					resolve(result)
				}
			})
	})
}

/**
 * 查询通知数量
 */
router.get('/queryNotificationCount', (req, res, next) => {
	const { department } = req.query
	queryNotificationCount(department)
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
async function queryNotificationCount(department) {
	return new Promise((resolve, reject) => {
		const filter = {}
		if (department) {
			filter = {
				department: {
					departmentNumber: department,
				},
			}
		}

		notification.countDocuments(filter).exec((err, result) => {
			if (err) reject(err)
			else {
				resolve(result)
			}
		})
	})
}

/**
 * 编辑通知信息
 *
 */
router.post('/editNotification', (req, res, next) => {
	const id = req.body._id
	const obj = req.body.obj
	editNotification(id, obj)
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

async function editNotification(_id, obj) {
	return new Promise((resolve, reject) => {
		notification.updateOne(
			{
				_id,
			},
			{ $set: obj },
			(err, data) => {
				if (err) reject(err)
				else {
					resolve(data)
				}
			}
		)
	})
}

/**
 * 撤销通知
 */

router.post('/revocateNotification', (req, res, next) => {
	revocateNotification(obj)
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

async function revocateNotification(_id) {
	return new Promise((resolve, reject) => {
		notification.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					status: 2, //2代表撤销状态
				},
			},
			(err, data) => {
				if (err) reject(err)
				else {
					resolve(data)
				}
			}
		)
	})
}

//查询详细信息
router.get('/queryNoticesDetail', (req, res, next) => {
	const id = req.query.id
	if (!id) {
		res.send({
			code: 400,
			data: '查询的id不正确',
		})
		return
	}
	queryNoticesDetail(id)
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
async function queryNoticesDetail(id) {
	return new Promise((resolve, reject) => {
		notification
			.find({
				_id: id,
			})
			.exec((err, result) => {
				if (err) reject(err)
				else {
					resolve(result)
				}
			})
	})
}

/**
 * 删除通知信息deleteNotices
 */
router.post('/deleteNotices', (req, res, next) => {
	console.log(req.body.id)
	deleteNotices(req.body.id).then((flag) => {
		if (flag) {
			res.send({
				code: 200,
				mes: '通知删除成功',
			})
		} else {
			res.send({
				code: 400,
				mes: '通知删除失败',
			})
		}
	})
})
async function deleteNotices(_id) {
	return new Promise((resolve) => {
		notification.deleteOne({ _id }, (err, data) => {
			if (err) resolve(false)
			else {
				console.log(data)
				resolve(true)
			}
		})
	})
}
module.exports = router
