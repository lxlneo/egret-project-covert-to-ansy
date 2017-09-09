
var loadScript = function (list, callback) {
    var loaded = 0;
    var loadNext = function () {
        loadSingleScript(list[loaded], function () {
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        })
    };
    loadNext();
};

var loadSingleScript = function (src, callback) {
    var s = document.createElement('script');
    s.async = false;
    s.src = src + "?v=" + Math.random();
    s.addEventListener('load', function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
};

var xhr = new XMLHttpRequest();
xhr.open('GET', './manifest.json?v=' + Math.random(), true);
xhr.addEventListener("load", function () {
    var manifest = JSON.parse(xhr.response);
    /*manifest.game.forEach(function(value, index, array) {
     array[index] += ("?v=" + Math.random());
     });*/
    var list = manifest.initial.concat(manifest.game);
    loadScript(list, function () {
        /**
         * {
             * "renderMode":, //引擎渲染模式，"canvas" 或者 "webgl"
             * "audioType": 0 //使用的音频类型，0:默认，2:web audio，3:audio
             * "antialias": //WebGL模式下是否开启抗锯齿，true:开启，false:关闭，默认为false
             * "retina": //是否基于devicePixelRatio缩放画布
             * }
         **/
        egret.runEgret({renderMode: "canvas", audioType: 0});
    });
});
xhr.send(null);
