/**
 * 在mongodb云端配置的用户名和密码
 */
const userName = 'root'
const pwd = '123456aaa'

/**
 * 数据库名称meeting
 */
const storeName = 'meeting'

const mongoDB_USER_STR = `mongodb+srv://${userName}:${pwd}@cluster0-rjlkr.mongodb.net/${storeName}?retryWrites=true&w=majority`
module.exports = {
	mongoDB_USER_STR,
}
