/**
 * Created by Administrator on 2017/12/12.
 */
/**
 * Created by Administrator on 2017/8/10.
 */
'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var P = require('bluebird')
var _ = require('lodash')

//用户
var mointorSchema = Schema({
    //歌曲总数
    musicNum:{
        type:Number,
        default:0
    },
    //歌曲播放量
    m_playNum:{
        type:Number,
        default:0
    },
    //用户数
    userNum: {
        type:Number,
        default:0
    },
    //下载量
    download:{
        type:Number,
        default:0
    },
    //今日新增用户
    newUserNum:{
        type:Number,
        default:0
    },
    //今日新增歌曲
    newMusicNum:{
        type:Number,
        default:0
    },
    //网站浏览量
    visitNum:{
        type:Number,
        default:0
    },
    //网站url
    site:{
        type:String,
        default:"www.oibip.com"
    }
})

require('../base/schema.js')(mointorSchema)
mointorSchema.statics.PfindByEmail = function (email) {
    return this.PfindOne({email:email})
}


mointorSchema.statics.Pupdate = function (id, options) {
    return this.PfindOneAndUpdate({_id: id}, {$set: options})
}

mointorSchema.statics.Penable = function (id,re) {
    return this.PfindOneAndUpdate({_id: id}, {$set: {enable:re}})
}

module.exports = mointorSchema