/**
 * Created by neo on 2017/9/8.
 */


var path = require('path');
var fs = require('fs');

var INDEX_HTML_DATA = '';
var INDEX_FILE_PATH = './index.html';
var JS_FILE_NAME = 'mainifest.json';
var LIB_JS_REGEX = /<!--modules_files_start--\>([\s\S]*)<!--modules_files_end--\>/gi;
var GMAE_JS_REGEX = /<!--game_files_start--\>([\s\S]*)<!--game_files_end--\>/gi;
var EGRET_JS_REGEX = /egret.runEgret[^;]+;/;
var SRC_REGEX = /src="(\S+)"></;
function readIndexFile() {
    INDEX_HTML_DATA = fs.readFileSync(INDEX_FILE_PATH, 'utf-8');
}

/***
 *
 * @param regx
 * @returns {Array}
 */
function getJsLibPath(regx) {
    var js_lib_str = INDEX_HTML_DATA.match(regx)[0];
    var js_lib_array = js_lib_str.split('\n');
    js_lib_array.pop();
    js_lib_array.shift();
    return js_lib_array;
}

function getUrl(scripturls) {
    var result = [];
    if (Array.isArray(scripturls)) {
        scripturls.map(function (item, index) {
            var src = item.match(SRC_REGEX);
            if (src && src[1]) {
                result.push(src[1]);
            }
        })
        return result;
    }
}
function buildMainifest() {
    var libjs = getJsLibPath(LIB_JS_REGEX);
    var gamejs = getJsLibPath(GMAE_JS_REGEX);
    var src_json = getUrl(libjs.concat(gamejs));
    fs.writeFileSync(JS_FILE_NAME, JSON.stringify(src_json));
}
function buildIndex() {
    var loadJs = fs.readFileSync('./loadjs.js', 'utf-8');
    INDEX_HTML_DATA = INDEX_HTML_DATA.replace(LIB_JS_REGEX, '').replace(GMAE_JS_REGEX, '').replace(EGRET_JS_REGEX,loadJs);
    fs.writeFileSync(INDEX_FILE_PATH, INDEX_HTML_DATA);
}

function coverEgretIndex() {
    readIndexFile()
    buildMainifest();
    buildIndex();
}

module.exports = coverEgretIndex;