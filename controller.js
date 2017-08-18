const fs = require('fs');
const path = require('path')
const router = require('koa-router')();

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function findSync(dir) {
    let result = [];
    function finder(dir) {
        let files = fs.readdirSync(dir);
        files.forEach((val,index) => {
            let fPath = path.join(dir, val);
            let stats = fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath);
        });

    }
    finder(dir);
    return result;
}

function addControllers(router, dir) {
    findSync(dir).filter((f) => {
        let index = f.indexOf("controllers");
        if(index != -1)
            return f.endsWith('.js');
    }).forEach((f) => {
        let fpath = f.replace(dir, "");
        console.log(`process controller: ${fpath}...`);
        let mapping = require(f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    var controllersDir = dir || 'controllers';
    addControllers(router, controllersDir);
    return router.routes();
};