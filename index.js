var FormData = require('form-data');
var BufferHelper = require('bufferhelper');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var assert = require('assert');
var rimraf = require('rimraf');

var url = '';

var option = {};

function processFile(file) {
    return new Promise(function(resolve, reject) {
        let form = new FormData();
        form.append('token', option.token);
        form.append('product_id', option.productId);
        form.append('online_time', option.time);
        form.append('sourcemap', fs.createReadStream(file));

        form.submit(option.receiver, function(err, res) {
            let bufferHelper = new BufferHelper();
            let concat = bufferHelper.concat.bind(bufferHelper);
            res.on('data', concat);
            res.on('end', () => {
                let r = bufferHelper.toBuffer().toString();
                let json = JSON.parse(r);
                if (json.error_no) {
                    console.log(json.error_no, decodeURIComponent(json.error_msg));
                    return reject(e);
                }
                resolve(file);
            });
        });
    });
}

function removeFile(file) {
    return new Promise(function(resolve, reject) {
        rimraf(file, { glob: false }, function(e) {
            if (e) {
                reject(e);
            } else {
                resolve(file);
            }
        });
    });
}

function upload(patterns, config) {
    option = Object.assign(
        {
            time: Date.now()
        },
        JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })).perfUpload,
        config
    );
    patterns = [].concat(patterns).filter(v => v);
    if (patterns.length === 0) {
        patterns = [].concat(option.files);
    }
    var { token, productId, receiver } = option;
    assert.equal(typeof token, 'string', 'perf-sourcemap-upload: token should be a string');
    assert.equal(typeof productId, 'string', 'perf-sourcemap-upload: productId should be a string');
    assert.equal(typeof receiver, 'string', 'perf-sourcemap-upload: receiver should be a string');

    if (patterns.length === 0) {
        return Promise.resolve([]);
    }

    return Promise.all(
        patterns.map(function(p) {
            return new Promise(function(resolve, reject) {
                glob(
                    p,
                    {
                        absolute: true,
                        nodir: true,
                        nosort: true
                    },
                    function(err, files) {
                        if (err) {
                            reject(err);
                        }
                        resolve(files);
                    }
                );
            });
        })
    )
        .then(function(list) {
            // flat and unique
            list = [].concat.apply([], list).filter((v, i, array) => array.indexOf(v) === i);
            // console.log(list);
            return Promise.all(list.map(processFile));
        })
        .then(function(list) {
            if (option.clean) {
                return Promise.all(list.map(removeFile));
            } else {
                return list;
            }
        });
}
module.exports = upload;
