/**
 * Created by Administrator on 2017/8/10.
 */
'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var P = require('bluebird')
var _ = require('lodash')

var adminSchema = Schema({
    username:{
        type:String,
        unique:true
    },
    password: {
        type:String,
    },
    //邮箱
    email:{
        type:String
    },
    //名字
    name:{
        type:String
    },
    //电话
    tel:{
        type:String
    },
    //权限
    role:{
        type:Number,
    },
    //注册时间
    register_at:{
        type:String
    },
    //上次登录时间
    lastTime:{
        type:String
    },
    //状态
    stat:{
        type:Boolean
    }
})

require('../base/schema.js')(adminSchema)
adminSchema.statics.PfindByEmail = function (email) {
    return this.PfindOne({email:email})
}


adminSchema.statics.Pupdate = function (id, options) {
    return this.PfindOneAndUpdate({_id: id}, {$set: options})
}

adminSchema.statics.Penable = function (id,re) {
    return this.PfindOneAndUpdate({_id: id}, {$set: {enable:re}})
}

module.exports = adminSchema