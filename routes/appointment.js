/**
 * 获取预约信息列表
 */
const express = require('express')
const router = express.Router()
const Appoint = require('../models/appointment')

/**
 * 获取预约信息接口
 * 根据不同的参数过滤信息
 */
router.get('/getAppoList', function (req, res, next) {
    //1.通过传递过来的参数，查询所有预约信息
    const query = req.query; //获取url地址上的参数 query是查询条件
	//2.查询mongodb中的信息
	queryAppoList(query)
		.then(function (data) {
			console.log(data)
			res.send(data)
		})
		.catch(function (e) {
			res.send(e)
		})
})

/**
 * 添加预约信息接口
 */
router.post('/addAppoItem', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
	const parms = req.body ? new Appoint(req.body) : null
	if (!parms) return '添加预约失败，请填写正确参数'
	addAppoItem(parms)
		.then(function (msg) {
			res.send(msg)
		})
		.catch(function (e) {
			res.send(e)
		})
})

/**
 * 删除预约信息接口（）
 */
router.post('/deleteAppoItems', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
    //2.查询mongodb中的信息
    deleteAppoItems().then((data)=>{

    }).catch((e)=>{
        res.send(e);
    })
})

/**
 * 修改预约信息接口
 */
router.post('/updateAppoItem', function (req, res, next) {
	//1.通过传递过来的参数，查询所有预约信息
	//2.查询mongodb中的信息
})
module.exports = router

/**
 * 数据库操作
 * @param {Object}} item 
 */
//插入会议预约信息
async function addAppoItem(item) {
	return new Promise(function (resolve, reject) {
		Appoint.create(item, function (err, docs) {
			if (err) {
				reject('会议预定失败')
			} else {
				resolve('会议预定成功')
			}
		})
	})
}

//查询数据
async function queryAppoList() {
	return new Promise(function (resolve, reject) {
		Appoint.find(function (err, data) {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

//删除数据
async function deleteAppoItems(){

}