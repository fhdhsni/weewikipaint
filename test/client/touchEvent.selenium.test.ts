/* tslint:disable triple-equals */
import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';
import * as fs from 'fs';
import sendToSaucelab from '../sendToSaucelab';

let sessionID: string;
let USERNAME: string;
let PASSWORD: string;

test.describe('Userinteraction Touch Event (Smoke Test) ', function (): any {
    if (process.env.SAUCE_USERNAME == undefined) {
        return undefined;
    }
    const By = webdriver.By;
    this.timeout(300000);
    test.beforeEach(function () {
        USERNAME = process.env.SAUCE_USERNAME;
        PASSWORD = process.env.SAUCE_ACCESS_KEY;
        this.browser = new webdriver.Builder()
            .usingServer(`http://${USERNAME}:${PASSWORD}@ondemand.saucelabs.com:80/wd/hub`)
            .withCapabilities({
                'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                'build': process.env.TRAVIS_BUILD_NUMBER,
                'username': USERNAME,
                'accessKey': PASSWORD,
                'browserName': 'android',
                'deviceName': 'Android Emulator',
                'version': '5.1',
            }).build();
        this.browser.getSession()
            .then((val: any) => {
                sessionID = val.id_;
            });

        return this.browser.get('http://localhost:8000/');
    });
    test.afterEach(function () {
        return this.browser.quit();
    });
    test.it('Should respond to touch events', function () {
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

            this.browser.touchActions()
                .tapAndHold({ x, y })
                .move({ x: x + 50, y })
                .release({ x: x + 50, y })
                .perform();
        });
        this.browser.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;
            let path = div.querySelectorAll('path')[1]; // selecting the line instead of the dot

            return path.getAttribute('d');
        }).then((d: string) => {
            const values = d.match(/[a-z](\d)*/gi);
            const start = values[0].replace(/\w/i, '');
            const end = values[1].replace(/\w/i, '');

            try {
                assert.equal(
                    Number(end) - Number(start), 50,
                    'a line with the length of 50 pixels should\'ve been drawn');
            } catch (e) {
                sendToSaucelab(false, USERNAME, PASSWORD, sessionID);
                throw e;
            }
            sendToSaucelab(true, USERNAME, PASSWORD, sessionID);
        });
    });
});
