/**
 * 获取预约信息列表
 */
const express = require('express')
const router = express.Router()
const qs = require('qs')
const appointment = require('../models/appointment')
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

/**
 * 获取预约信息接口
 * 根据不同的参数过滤信息
 */

//用于会议预约查询页面
router.post('/getAppoList', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	let query = req.body.data.filter //
	let limit = req.body.data.limit
	let skip = req.body.data.skip
	//2.查询mongodb中的信息
	//query = qs.parse(query)
	queryAppoList(query, skip, limit)
		.then(function (data) {
			console.log(data)
			res.send(data)
		})
		.catch(function (e) {
			res.send(e)
		})
})
async function queryAppoList(
	{ title, meetingDate, meetingRoomNumber },
	skip = 0,
	limit = 10
) {
	const newMeetingDate = dayjs.utc(meetingDate).format()

	return new Promise((resolve, reject) => {
		// {
		//     $and: [
		//         { title: title },
		//         { meetingDate: meetingDate },
		//         { meetingRoomNumber: meetingRoomNumber },
		//     ],
		// }
		let filterVal = {
			title: {
				$regex: title,
			},
			appointDate: newMeetingDate,
			meetingRoomNumber: meetingRoomNumber,
		}
		if (!title) {
			delete filterVal.title
		}
		if (!meetingDate) {
			delete filterVal.appointDate
		}
		if (!meetingRoomNumber) {
			delete filterVal.meetingRoomNumber
		}
		appointment
			.find(filterVal)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.exec((err, data) => {
				if (err) {
					reject('获取appointment列表失败')
				} else {
					resolve(data)
				}
			})
	})
}
/**
 * 添加预约信息接口
 */
router.post('/createAppointment', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
	const parms = req.body ? new appointment(req.body) : null
	if (!parms) return '添加预约失败，请填写正确参数'
	createAppointment(parms)
		.then(function (msg) {
			res.send({
				code: 200,
				data: msg,
			})
		})
		.catch(function (e) {
			res.send({
				code: 400,
				data: e,
			})
		})
})
//插入会议预约信息
async function createAppointment(item) {
	let meetingRoomNumber = item.meetingRoomNumber
	let appointDate = item.appointDate
	let startTime = new Date(item.startTime)
	let endTime = new Date(item.endTime)
	return new Promise(function (resolve, reject) {
		//首先进行查询，判断需要添加的数据是否符合规则
		//1.时间无覆盖
		/**
         *  每提交一个新预定时间段，扫描一遍数据库，
            设当前扫du描的已经预订的时zhi间段[used_start,used_end]，
            看提交数据的[want_start,want_end]是否dao满足与[used_start,used_end]相交,
            若want_start<used_end && wang_end>used_start表明两个区间相交，则输出不能预定；
            否则，若不相交，再查看下一个数据库里的已预订时间，重复该过程。
            最终，都不相交的话，即可预定。
         */

		//查询当天所有该会议室的预定记录
		appointment.find(
			{
				meetingRoomNumber,
				appointDate,
			},
			(err, data) => {
				if (err) reject(err)
				else {
					if (data.length === 0) {
						//说明今天没有预约的会议
						//直接进行数据插入
						appointment.create(item, function (err, docs) {
							if (err) {
								reject('会议预定失败')
							} else {
								resolve('会议预定成功')
							}
						})
					} else {
						//扫描输出结果，查看已经预约的会议与需要预约的会议是否存在时间交集
						//如果有时间交集，则不能进行数据插入
						let b = true //标记字段，默认不存在交集时间
						data.forEach((element) => {
							const _st = new Date(element.startTime)
							const _et = new Date(element.endTime)
							if (
								(startTime < _et && endTime > _st) ||
								(_st == startTime && _et == endTime)
							) {
								b = false //存在交集时间
							}
						})
						if (b) {
							//不存在交集时间，插入数据
							appointment.create(item, function (err, docs) {
								if (err) {
									reject('会议预定失败')
								} else {
									resolve('会议预定成功')
								}
							})
						} else {
							reject('当前所选时间已经被占用，请重新选择预约时间')
						}
					}
				}
			}
		)
	})
}

/**
 * 删除预约信息接口（）
 */
router.post('/deleteAppointmentItem', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
	const itemId = req.body.id
	deleteAppoItems(itemId)
		.then((data) => {
			res.send({
				code: 200,
				data: data,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
//删除预约
async function deleteAppoItems(_itemId) {
	return new Promise((resolve, reject) => {
		appointment.deleteOne(
			{
				_id: _itemId,
			},
			(err, result) => {
				if (err) reject(err)
				else {
					resolve(result)
				}
			}
		)
	})
}

/**
 * 修改预约信息接口,作用于预约管理页
 */
router.post('/updateAppointmentItem', function (req, res, next) {
	const id = req.body.id
	const obj = req.body.obj
	updateAppointmentItem(id, obj)
		.then((data) => {
			res.send({
				code: 200,
				data: data,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})

async function updateAppointmentItem(id, obj) {
	return new Promise((resolve, reject) => {
		appointment.updateOne({ _id: id }, { $set: obj }, (err, result) => {
			if (err) reject(err)
			else {
				resolve(result)
			}
		})
	})
}

/**
 * 查询单条预约详情接口
 */

router.get('/queryAppointmentDetail', function (req, res, next) {
	const id = req.query.id
	queryAppointmentDetail(id)
		.then((data) => {
			res.send({
				code: 200,
				data: data,
			})
		})
		.catch((e) => {
			res.send({
				code: 400,
				data: e,
			})
		})
})
async function queryAppointmentDetail(id) {
	return new Promise((resolve, reject) => {
		appointment.findOne(
			{
				_id: id,
			},
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			}
		)
	})
}

//获取查询的数据数量
//查询所有的条目

router.get('/getQueryListCount', (req, res, next) => {
	//req.parse
	const filter = qs.parse(req.query)
	getQueryDataCount(filter).then((count) => {
		res.send({
			code: 200,
			count: count,
		}) //如果没有获取到的话，返回0
	})
})

//获取查询数据的总体数量
async function getQueryDataCount({ title, meetingDate, meetingRoomNumber }) {
	return new Promise(function (resolve, reject) {
		const filter = {
			title: {
				$regex: title,
			},
			appointDate: meetingDate,
			meetingRoomNumber,
		}
		//如果条件为空，则删除过滤条件
		if (!title) {
			delete filter.title
		}
		if (!meetingDate) {
			delete filter.appointDate
		}
		if (!meetingRoomNumber) {
			delete filter.meetingRoomNumber
		}
		appointment.countDocuments(filter, function (err, result) {
			if (err) {
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

/**
 * index页面中 当日会议模块的 数量条目总数获取接口
 */
router.get('/queryUserJoinedMeetingCount', (req, res, next) => {
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
async function queryUserJoinedMeetingCount({ meetingDate, userName }) {
	return new Promise((resolve, reject) => {
		appointment.countDocuments(
			{
				appointDate: dayjs.utc(meetingDate).format(),
				members: {
					$in: userName,
				},
			},
			(err, result) => {
				console.log(result)
				if (err) {
					resolve(0)
				} else {
					resolve(result)
				}
			}
		)
	})
}

/**
 * index页面查询当日会议显示条目接口
 * 默认显示3条数据
 * 支持分页查询
 */
router.get('/queryUserJoinedMeetingItems', (req, res, next) => {
	queryUserJoinedMeetingItems(qs.parse(req.query))
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((error) => {
			res.send({
				code: 400,
				data: error,
			})
		})
})

//查询函数
async function queryUserJoinedMeetingItems({
	userName,
	meetingDate,
	skip = 0,
	limit = 3,
}) {
	return new Promise((resolve, reject) => {
		appointment
			.find({
				members: {
					$in: userName,
				},
				appointDate: dayjs.utc(meetingDate).format(),
			})
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.sort('-1')
			.exec((err, result) => {
				if (err) {
					reject('查询当日会议数据失败')
				} else {
					resolve(result)
				}
			})
	})
}

/**
 * 获取所有部门的会议情况数据
 */
router.get('/getAppointmentNumberListByDept', (req, res, next) => {
	getAppointmentNumberListByDept()
		.then((result) => {
			res.send({
				code: 200,
				data: result,
			})
		})
		.catch((error) => {
			res.send({
				code: 400,
				data: error,
			})
		})
})

async function getAppointmentNumberListByDept() {
	return new Promise((resolve, reject) => {
		appointment.find({}, (err, result) => {
			if (err) reject(err)
			else {
				//整理全部数据，分离出各个部门的会议数量
				const array = []
				const developCount = result.filter((item) => {
					return item.department == '00010'
				}).length

				const saleCount = result.filter((item) => {
					return item.department == '00020'
				}).length

				const hrPart = result.filter((item) => {
					return item.department == '00030'
				}).length
				array[0] = {
					department: '技术开发部',
					code: '00010',
					data: developCount,
				}
				array[1] = {
					department: '产品销售部',
					code: '00020',
					data: saleCount,
				}
				array[2] = {
					department: '人事部',
					code: '00030',
					data: hrPart,
				}

				resolve(array)
			}
		})
	})
}

module.exports = router
