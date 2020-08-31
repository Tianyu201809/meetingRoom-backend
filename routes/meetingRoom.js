/**
 * meeting room 的增删改查情况
 */

var express = require('express')
var router = express.Router()
const meetingRoom = require('../models/meetingRoom')
const qs = require('qs')

//查询所有会议室条目接口
router.get('/queryMeetingRoomsList', (req, res, next) => {
	queryMeetingRoomsList().then((result) => {
		console.log(result)
		res.send({
			code: 200,
			data: result,
		})
	})
})

async function queryMeetingRoomsList() {
	return new Promise((resolve, reject) => {
		meetingRoom.find({}, (err, data) => {
			if (err) {
				console.log(err)
				reject('获取会议室数据失败')
			} else {
				resolve(data)
			}
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
router.post('/updateMeetingRoomInfo', (req, res, next) => {})
async function updateMeetingRoomInfo() {
	return new Promise((resolve, reject) => {})
}

module.exports = router
