const request = require('request-promise');

export default function sendToSaucelab(result: boolean, username: string, accessKey: string, sessionID: string) {
    const url = `https://saucelabs.com/rest/v1/${username}/jobs/${sessionID}`;

    request.put(url, {
        auth: {
            user: username,
            pass: accessKey,
            sendImmediately: true,
        },
        body: {
            passed: result,
            name: 'weewikiPaint end to end test via selenium',
        },
        json: true,
    }).then((data: string) => {
        // console.log(data);
    });
}
