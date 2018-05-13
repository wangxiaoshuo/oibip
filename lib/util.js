/**
 * Created by Administrator on 2017/8/11.
 */

var PATH = require('path')
const FS = require("fs");
var utils = module.exports;
//屏蔽字段
var filterData_g=FS.readFileSync(PATH.join(__dirname, "filterStr1.txt"),"utf-8");
var pbzArr_g = unique(filterData_g.split('、'));


exports.resolveRelative = function (___filename, relative) {
    return PATH.join(PATH.dirname(___filename), relative)
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

exports.random = function (min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};


//数组去重
function unique(arr){

    var res =[];

    var json = {};

    for(var i=0;i<arr.length;i++){

        if(!json[arr[i]]){

            res.push(arr[i]);

            json[arr[i]] = 1;

        }

    }

    return res;

}
//过滤屏蔽字段
utils.getFilterStr_g = function(oldStr){
    console.log("==getFilterStr==");

    if(!oldStr){
        console.log("oldStr is null %j",oldStr);
        return "";
    }

    if(!filterData_g){
        console.error("filterData is null %j",filterData_g);
        return oldStr;
    }

    console.log("oldStr %j",oldStr);

    var allPBStr = [];

    for(var i = 0;i <pbzArr_g.length;i++){
        var curStr = pbzArr_g[i];
        if(oldStr.indexOf(curStr) != -1 && curStr != ''){
            allPBStr.push(curStr);
        }
    }
    console.log("allPBStr",allPBStr)
    //console.log("allPBStr1 %j",allPBStr);

    allPBStr.sort(function(a,b){
        return -(a.length - b.length);
    })

    //console.log("allPBStr2 %j",allPBStr);

    for(var i = 0;i <allPBStr.length;i++){
        var curStr = allPBStr[i];
        if(oldStr.indexOf(curStr) != -1 && curStr){
            var star = ""
            for(var j = 0;j<curStr.length;j++){
                star += '*';
            }
            oldStr = oldStr.replace(new RegExp(curStr,'g'),star);
        }
    }

    console.log("newStr %j",oldStr);

    return oldStr;
}
//判断是否有屏蔽字段
utils.hasFilterStr_g = function(oldStr){
    console.log("==hasFilterStr_g==");

    if(!oldStr){
        console.log("oldStr is null %j",oldStr);
        return "";
    }

    if(!filterData_g){
        console.error("filterData is null %j",filterData_g);
        return oldStr;
    }

    console.log("oldStr %j",oldStr,pbzArr_g);

    for(var i = 0;i <pbzArr_g.length;i++){
        var curStr = pbzArr_g[i];
        if(oldStr.indexOf(curStr) != -1 && curStr != ' ' && curStr.length > 0){
            return true
        }
    }
    return false
}