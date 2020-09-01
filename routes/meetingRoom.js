/**
 * meeting room 的增删改查情况
 */

var express = require('express')
var router = express.Router()
const meetingRoom = require('../models/meetingRoom')
const qs = require('qs')

//查询所有会议室条目接口
router.post('/queryMeetingRoomsList', (req, res, next) => {
	//filter对象中需要包含 meetingRoomNumber
	//const filter = qs.parse(req.query)
	let filter = req.body.data
	if (!filter) {
		filter = {
			skip: '',
			limit: '',
			filter: {},
		}
	}
	queryMeetingRoomsList(filter).then((result) => {
		console.log(result)
		res.send({
			code: 200,
			data: result,
		})
	})
})

async function queryMeetingRoomsList({ filter = {}, skip = 0, limit = 10 }) {
	return new Promise((resolve, reject) => {
		meetingRoom
			.find(filter)
			.skip(skip)
			.limit(limit)
			.exec((err, data) => {
				if (err) {
					console.log(err)
					reject('获取会议室数据失败')
				} else {
					resolve(data)
				}
			})
	})
}

//根据过滤条件查询会议室条目总数量

router.post('/queryMeetingRoomsCount', (req, res, next) => {
	const filter = req.body.data
	queryMeetingRoomsCount(filter).then((result) => {
		if (parseInt(result.code) === 200) {
			res.send({
				code: 200,
				count: result.count,
			})
		} else {
			res.send({
				code: 400,
				count: result.count,
			})
		}
	})
})
//查询过滤方法
async function queryMeetingRoomsCount(filter) {
	return new Promise((resolve, reject) => {
		filter ? filter : (filter = {})
		meetingRoom.countDocuments(filter, (err, result) => {
			if (err) {
				resolve({
					code: 400,
					count: null,
				})
			}
			resolve({
				code: 200,
				count: result,
			})
		})
	})
}

/**
 * 添加meeting room
 */

router.post('/addMeetingRoom', (req, res, next) => {
	addMeetingRoom(req.body)
		.then((data) => {
			res.send({
				code: 200,
				data: data,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: null,
			})
			console.log(e)
		})
})
async function addMeetingRoom(meetingRoomInfo) {
	return new Promise((resolve, reject) => {
		let meetingRoomInstance = new meetingRoom(meetingRoomInfo) || null
		meetingRoom.create(meetingRoomInstance, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

/**
 * 删除会议室信息
 */
router.post('/deleteMeetingRoomInfo', (req, res, next) => {
	console.log(req.body.meetingRoomId)
	deleteMeetingRoomInfo(req.body.meetingRoomId).then((flag) => {
		if (flag) {
			res.send({
				code: 200,
				mes: '会议室数据删除成功',
			})
		} else {
			res.send({
				code: 400,
				mes: '会议室数据删除失败',
			})
		}
	})
})
async function deleteMeetingRoomInfo(_id) {
	return new Promise((resolve, reject) => {
		meetingRoom.deleteOne({ _id }, (err, data) => {
			if (err) resolve(false)
			else {
				console.log(data)
				resolve(true)
			}
		})
	})
}

/**
 * 修改会议室信息
 */
router.post('/updateMeetingRoomDetail', (req, res, next) => {
    const id = req.body.id
    const obj = req.body.modify
	updateMeetingRoomDetail(id, obj)
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
async function updateMeetingRoomDetail(id, obj) {
	return new Promise((resolve, reject) => {
		meetingRoom.updateOne(
			{
				_id: id,
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
 * 查询会议室详细信息
 */

router.get('/queryMeetingRoomDetail', (req, res, next) => {
	const id = req.query['id']
	console.log(id)
	queryMeetingRoomDetail(id)
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((err) => {
			res.send({
				code: 400,
				data: err,
			})
		})
})

async function queryMeetingRoomDetail(id) {
	return new Promise((resolve, reject) => {
		meetingRoom.findOne(
			{
				_id: id,
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

module.exports = router
