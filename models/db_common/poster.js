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
var posterSchema = Schema({
    poster:[{url:String}],
    update_at:{
        type:String
    }
})

require('../base/schema.js')(posterSchema)
posterSchema.statics.PfindByEmail = function (email) {
    return this.PfindOne({email:email})
}


posterSchema.statics.Pupdate = function (id, options) {
    return this.PfindOneAndUpdate({_id: id}, {$set: options})
}

posterSchema.statics.Penable = function (id,re) {
    return this.PfindOneAndUpdate({_id: id}, {$set: {enable:re}})
}

module.exports = posterSchema