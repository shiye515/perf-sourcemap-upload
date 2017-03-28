[![Dependency Status](https://david-dm.org/shiye515/perf-sourcemap-upload.svg)](https://david-dm.org/shiye515/perf-sourcemap-upload)
[![devDependency Status](https://david-dm.org/shiye515/perf-sourcemap-upload/dev-status.svg)](https://david-dm.org/shiye515/perf-sourcemap-upload#info=devDependencies)

安装 `npm install perf-sourcemap-upload`

## API

```javascript
var upload = require('perf-sourcemap-upload');
upload('dist/*.map', options).then(function(files) {
    // files 是刚才上传的文件的路径的数组
});
```

## options

options 可以通过upload的第二个参数传入，也可以配置在`package.json`的`perfUpload`字段

* receiver

    上传服务接口地址, 用于接收上传的sourcemap

* files

    作用同第一个参数，第一个参数如果为空则取这个值

* token

    access token，需要管理员在后台生成

* productId

    产品线id，不能为空

* clean

    默认`false`，如果设置为true，那么上传完成后删除对应的文件

## CLI

如果全局安装 `npm install perf-sourcemap-upload -g`，就可以直接用命令 `perf-sourcemap-upload <path> [<path> ...]`来上传，token 等其他配置需要在 `package.json` 中定义
