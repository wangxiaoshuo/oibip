/**
 * Created by Administrator on 2017/8/11.
 */

var Path = require('path')

exports.resolveRelative = function (___filename, relative) {
    return Path.join(Path.dirname(___filename), relative)
}

//判断是否是正确的邮箱格式
exports.isEmail = function (str) {
    var regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/gi
    return regEmail.test(str)
}

//去除字符串首尾空格
exports.trim = function (text) {
    if (typeof(text) == "string") {
        return text.replace(/^\s*|\s*$/g, "");
    }
    else {
        return text;
    }
}
//判断是否为空对象
exports.isEmptyObject = function (obj) {
    for(var key in obj){
        return false;//返回false，不为空对象
    }
    return true;//返回true，为空对象
}
//判断是否为空
exports.isEmpty = function (val) {
    switch (typeof(val)) {
        case 'string':
            return exports.trim(val).length == 0 ? true : false;
            break;
        case 'number':
            return val == 0;
            break;
        case 'object':
            return exports.isEmptyObject(val);
            break;
        case 'array':
            return val.length == 0;
            break;
        default:
            return true;
    }
}