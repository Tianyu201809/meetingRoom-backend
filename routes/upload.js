/**
 * 文件上传接口
 */
var express = require('express')
var router = express.Router()
const fs = require('fs')
const multer = require('multer')
const uploadMappingTable = require('../models/uploadMappingTable')
const { resolve } = require('path')

class uploadFileObjTemp {
	constructor() {
		this.appointmentID = obj.appointmentID || ''
		this.fileType = obj.fileType || ''
		this.originalname = obj.originalname || ''
		this.fileName = obj.fileName || ''
		this.fileSize = obj.fileSize || ''
		this.encoding = obj.encoding || ''
	}
}
router.post(
	'/uploadMeetingFile',
	multer({ dest: 'upload' }).array('file', 10),
	(req, res, next) => {
		//首先需要保存在一个文件映射的表中
		//之后将文件保存在服务器目录下
		console.log(req.files)
		//将映射关系保存在数据表中，异步

		const _files = req.files
		files = _files.map((file) => {
			file.appointmentID = req.body.appointmentID
			return file
		})
		//const filesList = []
		// for (const i in files) {
		// 	let file = files[i]
		// 	fs.renameSync(file.path, `upload/${file.originalname}`)
		// 	file.path = `upload/${file.originalname}` //使用fs模块在本地改了名字
		// 	filesList.push(file)
		// }
		mappingFileItems(files)
			.then((result) => {
				console.log(result)
				res.send(result)
			})
			.catch((e) => {
				res.send(e)
			})
	}
)

/**
 * 异步方法，整理文件上传映射关系
 */

async function mappingFileItems(files) {
	return new Promise((resolve1, reject1) => {
		let array = []
		for (let i = 0; i < files.length; i++) {
			array[i] = new Promise(function (resolve, reject) {
				uploadMappingTable.create(
					new uploadMappingTable(files[i]),
					(err, result) => {
						if (err)
							reject({
								fileName: files[i].fileName,
								code: 400,
								data: '映射数据添加失败',
							})
						else {
							resolve({
								fileName: files[i].fileName,
								code: 200,
								data: '映射数据添加成功',
							})
						}
					}
				)
			})
		}
		Promise.all(
			array.map((p) => {
				return p.catch(function (e) {
					return e
				})
			})
		)
			.then((result) => {
				resolve1(result)
			})
			.catch((e) => {
				reject1(e)
			})
	})
}
//创建映射关系数据
async function createFileMappingItems(file) {
	return new Promise((resolve, reject) => {})
}

router.get('/download', (req, res) => {
	const url = req.params.url
	url
		? res.dpwnload(`upload/${url}`)
		: res.send({
				status: false,
				data: '没有找到文件',
		  })
})

module.exports = router
