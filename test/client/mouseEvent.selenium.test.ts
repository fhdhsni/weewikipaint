/* tslint:disable triple-equals */
import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';
import * as fs from 'fs';
import sendToSaucelab from '../sendToSaucelab';

let inTravis = false;
let sessionID: string;
let USERNAME: string;
let PASSWORD: string;

test.describe('Userinteraction Mouse Event (Smoke Test)', function () {
    const By = webdriver.By;
    this.timeout(300000);
    test.beforeEach(function () {
        if (process.env.SAUCE_USERNAME != undefined) {
            USERNAME = process.env.SAUCE_USERNAME;
            PASSWORD = process.env.SAUCE_ACCESS_KEY;
            inTravis = true;
            this.browser = new webdriver.Builder()
                .usingServer(`http://${USERNAME}:${PASSWORD}@ondemand.saucelabs.com:80/wd/hub`)
                .withCapabilities({
                    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                    'build': process.env.TRAVIS_BUILD_NUMBER,
                    'username': USERNAME,
                    'accessKey': PASSWORD,
                    'platform': 'OS X 10.11',
                    'browserName': 'chrome',
                }).build();
            this.browser.getSession()
                .then((val: any) => {
                    sessionID = val.id_;
                });

            return this.browser.get('http://localhost:8000/');
        } else {
            this.browser = new webdriver.Builder()
                .forBrowser('phantomjs')
                .build();

            return this.browser.get(`http://localhost:8000/`);
        }
    });
    test.afterEach(function () {
        return this.browser.quit();
    });
    test.it('Should respond to mouse events', function () {
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
        }).then((offset: OffsetObject) => {
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
                .mouseMove({ x: 50, y: -20 })
                .mouseUp()
                .perform();
        });
        this.browser.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;
            let path = div.querySelectorAll('path')[1]; // selecet the line not the dot

            return path.getAttribute('d');
        }).then((d: string) => {
            const x12 = d.match(/[a-z](\d)*/gi); // get the x1 and x2
            const y12 = d.match(/,(\d)*/gi); // get the y1 and y2
            const x1 = x12[0].replace(/\w/i, '');
            const x2 = x12[1].replace(/\w/i, '');
            const y1 = y12[0].replace(/,/i, '');
            const y2 = y12[1].replace(/,/i, '');

            if (inTravis) {
                try {
                    assert.equal(
                        Number(x2) - Number(x1), 50, 'a line with the width of 50 pixels should\'ve been drawn');
                    assert.equal(
                        Number(y2) - Number(y1), -20, 'a line with the height of -20 pixels should\'ve been drawn');
                } catch (e) {
                    sendToSaucelab(false, USERNAME, PASSWORD, sessionID);
                    throw e;
                }
                sendToSaucelab(true, USERNAME, PASSWORD, sessionID);
            } else {
                assert.equal(
                    Number(x2) - Number(x1), 50, 'a line with the width of 50 pixels should\'ve been drawn');
                assert.equal(
                    Number(y2) - Number(y1), -20, 'a line with the height of -20 pixels should\'ve been drawn');
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
