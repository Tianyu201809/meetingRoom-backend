const mongoose = require('mongoose')
const Schema = mongoose.Schema
const meetingRoom = new Schema({
	meetingRoomNumber: {
		type: String,
	},
	meetingRoomStatus: {
		type: String,
	},
	meetingRoomSize: {
		type: Number,
		default: 4,
	},
	hasMedia: {
		type: Boolean,
		default: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: Object,
		default: function () {
			return {}
		},
	},
	lastModify: {
		type: Date,
		default: Date.now,
	},
	lastModifyBy: {
		type: Object,
		default: function () {
			return {}
		},
	},

	/**
	 * 预留字段
	 */
	extend1: String,
	extend2: String,
})

module.exports = mongoose.model('meetingRooms', meetingRoom)