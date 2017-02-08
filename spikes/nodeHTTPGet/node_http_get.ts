import * as http from 'http';

http.get('http://localhost:8080', (res) => {
    const statusCode = res.statusCode;
    console.log(statusCode);

    let error;
    if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
            `Status Code: ${statusCode}`);
    }

    if (error) {
        console.log(error.message);
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        let parsedData = rawData;
        console.log(parsedData);
    });
}).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
});
