/* tslint:disable triple-equals max-line-length */
import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';

// const driver = new webdriver.Builder()
//     .withCapabilities({
//         browserName: 'chrome',
//         platform: 'Windows 10',
//         version: '56',
//         username,
//         accessKey,
//     })
//     .usingServer(`http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`)
//     .build();
// const By = webdriver.By;

test.describe('saucelabs test', function () {
    const By = webdriver.By;
    this.timeout(300000);
    test.beforeEach(function () {
        if (process.env.SAUCE_USERNAME != undefined) {
            console.log('inside saucelabs...');
            console.log(process.env.SAUCE_USERNAME);
            console.log(process.env.SAUCE_ACCESS_KEY);
            this.browser = new webdriver.Builder()
                .usingServer('http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub')
                .withCapabilities({
                    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                    'build': process.env.TRAVIS_BUILD_NUMBER,
                    'username': process.env.SAUCE_USERNAME,
                    'accessKey': process.env.SAUCE_ACCESS_KEY,
                    'platform': 'Windows 10',
                    'browserName': 'chrome',
                }).build();
        } else {
            console.log('inside phantomjs');
            this.browser = new webdriver.Builder()
                .withCapabilities({
                    browserName: 'phantomjs',
                }).build();
        }

        return this.browser.get('http://localhost:8000/');
    });

    test.afterEach(function () {
        return this.browser.quit();
    });

    test.it('should respond to click', function () {
        this.browser.getTitle()
            .then((val: string) => {
                assert.equal(val, 'WeeWikiPaint', 'titles didn\'t match');
            });
    });
});
