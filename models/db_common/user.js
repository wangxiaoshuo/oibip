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
var userSchema = Schema({
    //用户名
    username:{
        type:String,
        unique:true
    },
    //昵称
    nickname:{
        type:String
    },
    password: {
        type:String
    },
    age:{
      type:String
    },
    sex:{
        type:Number
    },
    //联系方式
    email:{
        type:String
    },
    tel:{
        type:String
    },
    qq:{
        type:String
    },
    wx:{
        type:String
    },
    //工作地点
    job_city:{
        type:Object
    },
    born_at:{
        type:String
    },
    //头像
    tx:{
        type:String
    },
    role:{
        type:Number,
    },
    //金币
    gold:{
      type:String,
        default:0
    },
    //签名
    qm:{
        type:String
    },
    music:[{m_name:String,singer:String,qu:String,ci:String,sign:String,m_bg:String,url:String}],
    sc:[{m_name:String,singer:String,qu:String,ci:String,sign:String,m_bg:String,url:String}],
    create_at:{
        type:String
    },
    //最近上线时间
    update_at:{
        type:String
    }
})

require('../base/schema.js')(userSchema)
userSchema.statics.PfindByEmail = function (email) {
    return this.PfindOne({email:email})
}


userSchema.statics.Pupdate = function (id, options) {
    return this.PfindOneAndUpdate({_id: id}, {$set: options})
}

userSchema.statics.Penable = function (id,re) {
    return this.PfindOneAndUpdate({_id: id}, {$set: {enable:re}})
}

module.exports = userSchema