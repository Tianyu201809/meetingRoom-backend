/**
 * meeting room 的增删改查情况
 */

var express = require('express')
var router = express.Router()
const meetingRoom = require('../models/meetingRoom')
const qs = require('qs')

//查询所有会议室条目接口
router.get('/queryMeetingRoomsList', (req, res, next) => {
    queryMeetingRoomsList().then(result => {
        console.log(result);
        res.send({
            code:200,
            data:result
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

module.exports = router