const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uploadMappingTable = new Schema({
	appointmentID: String, //所对应的预约的id编号
	filetype: String, //文件类型（后缀名）
	originalname: String, //原始文件名称
	filename: String, //上传后的唯一文件名称
	filesize: String, //文件大小
    encoding: String, //？？
    url:String
})
module.exports = mongoose.model('uploadMappingTables', uploadMappingTable)

