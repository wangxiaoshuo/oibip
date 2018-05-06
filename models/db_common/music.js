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
var musicSchema = Schema({
    //歌曲名称
    m_name:{
        type:String,
    },
    //歌曲类型
    type: {
        type:String
    },
    //演唱
    singer:{
        type:String
    },
    //曲：
    qu:{
        type:String
    },
    ci:{
        type:String
    },
    sign:{
        type:String
    },
    url:{
        type:String
    },
    m_bg:{
      type:String
    },
    by:{
        type:String
    }
})

require('../base/schema.js')(musicSchema)
musicSchema.statics.PfindByEmail = function (email) {
    return this.PfindOne({email:email})
}


musicSchema.statics.Pupdate = function (id, options) {
    return this.PfindOneAndUpdate({_id: id}, {$set: options})
}

musicSchema.statics.Penable = function (id,re) {
    return this.PfindOneAndUpdate({_id: id}, {$set: {enable:re}})
}

module.exports = musicSchema