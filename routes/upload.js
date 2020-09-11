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
	constructor(obj) {
		this.appointmentID = obj.appointmentID || '' //appointmentID
		this.filetype = obj.filename.split('.').slice(-1)[0] || '' //文件类型
		this.originalname = obj.originalname || '' //原始文件名
		this.filename = obj.filename || '' //文件名
		this.filesize = obj.size || ''
		this.encoding = obj.encoding || ''
		this.url = obj.path || ''
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
					new uploadFileObjTemp(files[i]),
					(err, result) => {
						if (err)
							reject({
								// fileName: files[i].filename,
								// originalname: files[i].originalname,
								// url: files[i].url,
								code: 400,
								data: err,
								mes: '添加失败',
							})
						else {
							resolve({
								// fileName: files[i].filename,
								// originalname: files[i].originalname,
								// url: files[i].url,
								code: 200,
								data: result,
								mes: '数据添加成功',
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

//文件下载接口
router.post('/download', (req, res) => {
	const url = req.body.url //这里传递的是ori文件名
	const filename = req.body.filename
	url
		? res
				.status(200)
				.set({
					'Context-Type': 'text/html',
					'Content-Disposition': `attachment; filename=${encodeURI(
						filename
					)}`,
				})
				.download(url, filename)
		: res.send({
				status: false,
				data: '没有找到文件',
		  })
})

/**
 * 文件查询接口
 */
router.get('/queryAppointmentFiles', (req, res) => {
	//首先获取appointmentID
	const appointmentID = req.query.id
	//查询该appointment上所含有的所有文件
	queryAppointmentFiles(appointmentID)
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
async function queryAppointmentFiles(appointmentID) {
	return new Promise((resolve, reject) => {
		uploadMappingTable.find(
			{
				appointmentID,
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
 * 删除文件接口
 */

//删除文件分成两个部分
//1.删除表格中的记录
//2.删除文件目录中的文件
router.post('/removeAppointmentFile', (req, res, next) => {
	const formId = req.body.id
	const url = req.body.url
	Promise.all(
		[removeDatabaseItem(formId), removeDocument(url)].map(async (p) => {
			try {
				return p
			} catch (e) {
				return e
			}
		})
	)
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

async function removeDatabaseItem(id) {
	return new Promise((resolve, reject) => {
		uploadMappingTable.deleteOne({ _id: id }, (err, data) => {
			if (err) reject(err)
			else {
				resolve(data)
			}
		})
	})
}

async function removeDocument(url) {
	return new Promise((resolve, reject) => {
		fs.unlink(url, function (error) {
			if (error) {
				console.log(error)
				reject({
					code: 400,
					mes: '文件删除失败',
				})
			}
			resolve({
				code: 200,
				mes: '文件删除成功',
			})
		})
	})
}
module.exports = router
