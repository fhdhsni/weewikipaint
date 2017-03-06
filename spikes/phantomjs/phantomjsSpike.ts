/* tslint:disable */
console.log('Loading a web page');

var page = require('webpage').create();
var url = 'http://192.168.1.101:8080/';

page.onConsoleMessage = function (msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg);
};

page.open(url, function (status) {
    page.evaluate(function () {
        console.log('HI');
    });
    page.render('wwp.png');
    phantom.exit();
});
