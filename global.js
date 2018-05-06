/**
 * Created by Administrator on 2017/12/6.
 */
'use strict';

var _ = require('lodash')

module.exports = function(){
    var global_ = {
        IS_PRODUCTION: 'production' === process.env.NODE_ENV,
    }
    _.extend(global, global_)
}