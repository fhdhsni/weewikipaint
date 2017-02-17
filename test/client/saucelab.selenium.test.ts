/* tslint:disable triple-equals max-line-length */
import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';
import sendToSaucelab from '../sendToSaucelab';
let inTravis = false;

test.describe('saucelabs test', function () {
    const By = webdriver.By;
    this.timeout(300000);
    test.beforeEach(function () {
        if (process.env.SAUCE_USERNAME != undefined) {
            inTravis = true;
            this.browser = new webdriver.Builder()
                .usingServer('http://' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub')
                .withCapabilities({
                    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                    'build': process.env.TRAVIS_BUILD_NUMBER,
                    'username': process.env.SAUCE_USERNAME,
                    'accessKey': process.env.SAUCE_ACCESS_KEY,
                    'platform': 'OS X 10.11',
                    'browserName': 'safari',
                    'version': '10.0',
                }).build();
            return this.browser.get('http://localhost:8000/');
        } else {
            this.browser = new webdriver.Builder()
                .withCapabilities({
                    browserName: 'phantomjs',
                }).build();
            const PORT = process.env.serverPort || 8080;

            return this.browser.get(`http://localhost:${PORT}/`);
        }
    });

    test.afterEach(function () {
        return this.browser.quit();
    });

    test.it('should respond to click', function () {
        let sessionID: string;
        this.browser.getSession()
            .then((val: any) => {
                sessionID = val.id_;
            });
        this.browser.getTitle()
            .then((val: string) => {

                if (inTravis) {
                    try {
                        assert.equal(val, 'WeeWikiPaint', 'titles didn\'t match');
                    } catch (e) {
                        sendToSaucelab(false, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, sessionID);
                        throw e;
                    }
                    sendToSaucelab(true, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, sessionID);
                } else {
                    assert.equal(val, 'WeeWikiPaint', 'titles didn\'t match');
                }
            });
    });
});
