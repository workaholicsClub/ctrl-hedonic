const service = require('express')({});
const bodyParser = require('body-parser');
const doubleDare = require('./double_dare.js');

const SERVICE_PORT = 3000;

service.use(bodyParser.json());
service.post('/callbacks/double-dare/', (request, response) => {
    let requestType = request.body.type;
    let hasHandler = typeof( doubleDare[requestType] ) !== 'undefined';

    if (hasHandler) {
        let handler = doubleDare[requestType];
        handler(request, response);
    }
    else {
        response.send("ok");
    }
});

service.listen(SERVICE_PORT);