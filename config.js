/**
 * Created by Administrator on 2017/12/6.
 */
'use strict';

//变量配置
var Constant = {
    'IS_CONFUSION': false,
    'PORT' : 3000,

    //数据库连接信息
    'MAIN_DB_URI': 'mongodb://127.0.0.1:27017/',
    'MONGOS': false,
    'COMMON_DB_NAME': 'db_town',
    'AUTH_DB_NAME' : 'admin'
}

var Config = {
    Constant : Constant
}

module.exports = Config