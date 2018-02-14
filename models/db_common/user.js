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
    sex:{
      type:String
    },
    age:{
      type:String
    },
    //出生日期
    born_at:{
      type:Object
    },
    //工作地点
    job_city:{
        type:Object
    },
    //籍贯
    born_city:{
        type:Object
    },
    xueli:{
        type:Number
    },
    job:{
        type:Number
    },
    qg:{
        type:Number
    },
    height:{
        type:String
    },
    smoke:{
        type:Number
    },
    drink:{
        type:Number
    },
    favourite:{
        type:Number
    },
    character:{
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
    //头像
    tx:{
        type:String
    },
    //相册
    img:[{_id:false,url:String,time:String,vip:Number}],
    //语音简介
    audio:{
        type:String
    },
    //视频
    video:[{_id:false,url:String,name:String,time:String,vip:Number}],

    role:{
        type:Number,
    },
    vip:{
        type:Number
    },
    //信誉值
    credit:{
      type:Number,
        default:100
    },
    //魅力值
    charm:{
        type:Number,
        default:50
    },
    //标签
    yx:[{_id:false,name:String,time:String}],
    //金币
    gold:{
      type:String,
        default:0
    },
    //收到的礼物
    gift:[{_id:false,name:String,sum:Number,from:String}],
    //签名
    qm:{
        type:String
    },
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