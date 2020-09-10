const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notification = new Schema({
	title: String,
	/**
	 * department有两个值
	 * 1.编号
	 * 2.名称
	 */
	department: {
		type: Object,
		default: function () {
			return {}
		},
	},
	/**
	 * 有效日期时间段
	 */
	startDate: {
		type: Date,
	},
	endDate: {
		type: Date,
	},
	status: {
		type: Number, //0代表未发布， 1代表已发布， 2已撤销
		default: function () {
			return 0
		},
	},
	createdBy: {
		type: Object,
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
	content: String,
})
//直接导出模型构造函数
module.exports = mongoose.model('notifications', notification)
