var AWS = require('aws-sdk');

var dyn = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
});

var params = {
    TableName: 'teamster-application-db',
    KeySchema: [{
            AttributeName: 'ssn',
            KeyType: 'HASH',
        },
    ],
    AttributeDefinitions: [{
            AttributeName: 'ssn',
            AttributeType: 'S',
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
};


dyn.createTable(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
});