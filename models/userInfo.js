const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userInfo = new Schema({
	userName: String,
	email: String,
	password: String,
	age: Number,
	birthday: String,
	location: String,
	avatar: {
		type: Buffer,
	},
	status: String,
	//创建日期
	createdDate: {
		type: Date,
		default: Date.now,
	},
	//最后修改时间
	modifyDate: {
		type: Date,
		default: Date.now,
	},
	role: {
		type: Number,
		default: 1, //1 普通用户  2高级管理员 3超级管理员
	},
})
//直接导出模型构造函数
module.exports = mongoose.model('userInfo', userInfo)
