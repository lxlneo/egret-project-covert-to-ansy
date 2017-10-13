
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
    s.setAttribute('egret','game');
    s.async = false;
    s.src = src + "?v=" + window.version || new Date().getTime();
    s.addEventListener('load', function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
};

var xhr = new XMLHttpRequest();
xhr.open('GET', './manifest.json?v=' + window.version || new Date().getTime(), true);
xhr.addEventListener("load", function () {
    var manifest = JSON.parse(xhr.response);
    loadScript(manifest, function () {
        egret.runEgret({renderMode: "canvas", audioType: 0});
    });
});
xhr.send(null);
