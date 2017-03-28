#!/usr/bin/env node

var upload = require('./');

var help = false;
var args = process.argv.slice(2).filter(function(arg) {
    if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
        help = true;
    } else {
        return !!arg;
    }
});

if (help) {
    // If they didn't ask for help, then this is not a "success"
    var log = help ? console.log : console.error;
    log('Usage: perf-sourcemap-upload <path> [<path> ...]');
    log('');
    log('  Upload all files at "path" recursively.');
    log('');
    log('Options:');
    log('');
    log('  -h, --help     Display this usage info');
    process.exit(help ? 0 : 1);
} else {
    upload(args).then(function(files) {
        console.log(files);
    });
}
