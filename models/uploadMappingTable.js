const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uploadMappingTable = new Schema({
	appointmentID: String, //所对应的预约的id编号
	fileType: String, //文件类型（后缀名）
	originalname: String, //原始文件名称
	fileName: String, //上传后的唯一文件名称
	fileSize: String, //文件大小
	encoding: String, //？？
})
module.exports = mongoose.model('uploadMappingTables', uploadMappingTable)
