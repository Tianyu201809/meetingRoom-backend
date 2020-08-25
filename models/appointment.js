const mongoose = require('mongoose')
const Schema = mongoose.Schema
const appointment = new Schema({
	//会议室编号
	meetingRoomNumber: {
        type: String,
        require:true
    },
    status:String,
	//订阅者
	subscriber: {
		type: String,  //使用订阅者邮箱/用户名两个值
	},
	//创建人
	createdBy: {
		type: Object, //使用订阅者邮箱/用户名两个值
	},
	//创建日期
	createdDate: {
		type: Date,
	},
	//预约概要
	content: {
		type: String,
	},
	//预约起始时间
	startTime: {
		type: Date,
	},
	//结束时间
	endTime: {
		type: Date,
	},
	//预约日期
	appointDate: {
		type: Date,
	},
	//参会成员
	members: {
		type: Array,
	},
	//最后修改人
	modifyBy: {
		type: String, //使用邮箱
	},
	//最后修改时间
	modifyDate: {
		type: Date,
		default: Date.now
	},
})
//直接导出模型构造函数
module.exports = mongoose.model('appointments', appointment)
