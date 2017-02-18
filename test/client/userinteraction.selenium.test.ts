/* tslint:disable triple-equals max-line-length */
import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';
import * as fs from 'fs';
import sendToSaucelab from '../sendToSaucelab';
let inTravis = false;

test.describe('userinteraction', function () {
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
                    'browserName': 'chrome',
                }).build();
            return this.browser.get('http://localhost:8000/');
        } else {
            this.browser = new webdriver.Builder()
                .forBrowser('phantomjs')
                .build();
            const PORT = process.env.serverPort || 8080;

            return this.browser.get(`http://${process.env.MYIP}:${PORT}/`);
        }
    });

    test.afterEach(function () {
        return this.browser.quit();
    });

    test.it('should respond to mouse events', function () {
        let sessionID: string;

        this.browser.getSession()
            .then((val: any) => {
                sessionID = val.id_;
            });

        this.browser.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;

            return {
                borderWidth: window.getComputedStyle(div).borderLeftWidth,
                paddingWidth: window.getComputedStyle(div).paddingLeft,
                top: div.offsetTop,
                left: div.offsetLeft,
                width: div.offsetWidth,
                height: div.offsetHeight,
            };
        }).then((offset: { top: string; left: string; borderWidth: string, paddingWidth: string, width: string, height: string }) => {
            // All this mess just to find the center of #drawingArea
            const top = parseInt(offset.top, 10);
            const left = parseInt(offset.left, 10);
            const border = parseInt(offset.borderWidth, 10);
            const padding = parseInt(offset.paddingWidth, 10);
            const width = parseInt(offset.width, 10);
            const height = parseInt(offset.height, 10);
            const x = left + border + padding + (width / 2);
            const y = top + border + padding + (height / 2);

            this.browser.actions()
                .mouseMove({ x, y })
                .mouseDown()
                .mouseMove({ x: 50, y: 0 })
                .mouseUp()
                .perform();
        });
        this.browser.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;
            let path = div.querySelector('path');

            return path.getAttribute('d');
        }).then((d: string) => {
            const values = d.match(/[a-z](\d)*/gi);
            const start = values[0].replace(/\w/i, '');
            const end = values[1].replace(/\w/i, '');

            if (inTravis) {
                try {
                    assert.equal(Number(end) - Number(start), 50, 'a line with the length of 50 pixels should\'ve been drawn');
                } catch (e) {
                    sendToSaucelab(false, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, sessionID);
                    throw e;
                }
                sendToSaucelab(true, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY, sessionID);
            } else {
                assert.equal(Number(end) - Number(start), 50, 'a line with the length of 50 pixels should\'ve been drawn');
            }
        });

        if (!inTravis) {
            this.browser.takeScreenshot()
                .then((photo: string) => {
                    fs.writeFile('generatedBySelenium.png', photo, 'base64', (err) => {
                        if (err) {
                            throw new Error(err.message);
                        }
                    });
                });
        }
    });
});
