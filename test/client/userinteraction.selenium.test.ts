import * as webdriver from 'selenium-webdriver';
import * as test from 'selenium-webdriver/testing';
import { assert } from 'chai';
import * as fs from 'fs';

test.describe('userinteraction', function () {
    this.timeout(30000);
    test.it('should respond to mouse events', function () {
        let top: number;
        let border: number;
        let padding: number;
        let left: number;
        const driver = new webdriver.Builder()
            .forBrowser('phantomjs')
            .build();

        driver.get('http://localhost:8000/');

        driver.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;

            return {
                borderWidth: window.getComputedStyle(div).borderWidth,
                paddingWidth: window.getComputedStyle(div).padding,
                top: div.offsetTop,
                left: div.offsetLeft,
            };
        }).then((offset: { top: string; left: string; borderWidth: string, paddingWidth: string }) => {
            top = parseInt(offset.top, 10);
            left = parseInt(offset.left, 10);
            border = parseInt(offset.borderWidth, 10);
            padding = parseInt(offset.paddingWidth, 10);

            driver.actions()
                .mouseMove({ x: left + border + padding, y: top + border + padding })
                .mouseDown()
                .mouseMove({ x: 50, y: 50 }) // moving away 50 pixels from top left corner
                .mouseUp()
                .perform();
        });
        driver.executeScript(function () {
            let div = document.getElementById('drawingArea') as HTMLElement;
            let path = div.querySelector('path');

            return path.getAttribute('d');
        }).then((d: string) => {
            const values = d.match(/[a-z](\d)*/gi);
            const start = values[0].replace(/\w/i, '');
            const end = values[1].replace(/\w/i, '');

            assert.equal(Number(end) - Number(start), 50, 'a line with the length of 50 pixels should\'ve been drawn');
        });

        driver.takeScreenshot()
            .then(photo => {
                fs.writeFile('generatedBySelenium.png', photo, 'base64', (err) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            });
        driver.quit();
    });
});
