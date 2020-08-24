/**
 * 获取预约信息列表
 */
const express = require('express')
const router = express.Router()
const Appoint = require('../models/appointment')
const qs = require('qs')
const appointment = require('../models/appointment')
const jwt = require('jsonwebtoken')

/**
 * 获取预约信息接口
 * 根据不同的参数过滤信息
 */

//用于会议预约查询页面
router.get('/getAppoList', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	const query = req.query //获取url地址上的参数 query是查询条件
	//2.查询mongodb中的信息
	query = qs.parse(query)
	queryAppoList(query)
		.then(function (data) {
			console.log(data)
			res.send(data)
		})
		.catch(function (e) {
			res.send(e)
		})
})

/**
 * 添加预约信息接口
 */
router.post('/addAppoItem', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
	const parms = req.body ? new Appoint(req.body) : null
	if (!parms) return '添加预约失败，请填写正确参数'
	addAppoItem(parms)
		.then(function (msg) {
			res.send(msg)
		})
		.catch(function (e) {
			res.send(e)
		})
})

/**
 * 删除预约信息接口（）
 */
router.post('/deleteAppoItems', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
	const itemId = req.body
	deleteAppoItems(itemId)
		.then((data) => {})
		.catch((e) => {
			res.send(e)
		})
})

/**
 * 修改预约信息接口
 */
router.post('/updateAppoItem', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
})
module.exports = router

/**
 * 数据库操作
 * @param {Object}} item
 */
//插入会议预约信息
async function addAppoItem(item) {
	return new Promise(function (resolve, reject) {
		Appoint.create(item, function (err, docs) {
			if (err) {
				reject('会议预定失败')
			} else {
				resolve('会议预定成功')
			}
		})
	})
}

//获取查询的数据数量
//查询所有的条目

router.get('/getQueryListCount', (req, res, next) => {
	getQueryDataCount().then((count) => {
		res.send(count) //如果没有获取到的话，返回0
	})
})

//获取查询数据的总体数量
async function getQueryDataCount() {
	return new Promise(function (resolve, reject) {
		appointment.count(null, function (err, result) {
			if (error) {
				resolve(0)
			}
			console.log(result)
			resolve(result)
		})
	})
}

/**
 * index页面相关的数据
 */
//查询个人相关的会议数据
router.get('/getUserJoinedMeeting', (req, res, next) => {
	queryUserJoinedMeeting(qs.parse(req.query))
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((e) => {
			console.log(e)
		})
})
async function queryUserJoinedMeeting({
	email,
	meetingDate,
	limit = 3,
	skip = 0,
}) {
	return new Promise(function (resolve, reject) {
		Appoint.find(
			{
				meetingDate: meetingDate,
				members: {
					$elemMatch: {
						email: email,
					},
				},
			},
			function (err, data) {
				if (err) {
					reject(err)
				} else {
					resolve(data)
				}
			}
		)
			.limit(limit)
			.skip(skip)
	})
}

router.get('/queryUserJoinedMeetingCount', (req, res, next) => {
    debugger;
    const query = qs.parse(req.query)
    console.log(query)
	queryUserJoinedMeetingCount(query).then((count) => {
		res.send({
			code: 200,
			count: count,
		})
	})
})

//作用于index页面中的今日会议部分的分页
async function queryUserJoinedMeetingCount({meetingDate, email}) {
	return new Promise((resolve, reject) => {
		appointment.countDocuments(
			{
				meetingDate: meetingDate,
				members: {
					$elemMatch: {
						email: email,
					},
				},
			},
			(err, result) => {
                console.log(result);
                if(err){
                    resolve(0)
                }else{
                    resolve(result)
                }
			}
		)
	})
}

/**
 * 删除数据相关接口
 * @param {*} _itemId
 */
//删除数据
async function deleteAppoItems(_itemId) {
	return new Promise((resolve, reject) => {})
}
