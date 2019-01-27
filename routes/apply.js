var express = require('express');
var router = express.Router();

/* GET apply page. */
router.get('/', function (req, res, next) {
  res.render('apply', {
    title: 'Application Form'
  });
});

//app.get('/', (request, response) => response.sendFile(`${path.join(__dirname, '../index-form-post-ddb.html')}`)); //(__dirname, '../) goes one folder up from current location 

router.post('/formPost', (req, res, next) => { //take POST request data from teamster apply page & put into database table
  const postBody = req.body;
  console.log(postBody);

  //the following puts 'postBody' json into dynamodb database/////////////////////////////////////////
  //can/should this be made more modular? <--maybe not...
  var AWS = require('aws-sdk');
  var dyn = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
  });

  var params = {
    TableName: "teamster-application-database",
    Item: { // a map of attribute name to AttributeValue
      union_number: {
        'S': Object.values(postBody)[0][0]
      },
      date: {
        'S': Object.values(postBody)[0][1]
      },
      lname: {
        'S': Object.values(postBody)[0][2]
      },
      fname: {
        'S': Object.values(postBody)[0][3]
      },
      mi: {
        'S': Object.values(postBody)[0][4]
      },
      occupation: {
        'S': Object.values(postBody)[0][5]
      },
      address: {
        'S': Object.values(postBody)[0][6]
      },
      phone: {
        'S': Object.values(postBody)[0][7]
      },
      city: {
        'S': Object.values(postBody)[0][8]
      },
      state: {
        'S': Object.values(postBody)[0][9]
      },
      zip: {
        'S': Object.values(postBody)[0][10]
      },
      employer: {
        'S': Object.values(postBody)[0][11]
      },
      employment_date: {
        'S': Object.values(postBody)[0][12]
      },
      employer_address: {
        'S': Object.values(postBody)[0][13]
      },
      employer_phone: {
        'S': Object.values(postBody)[0][14]
      },
      employer_city: {
        'S': Object.values(postBody)[0][15]
      },
      employer_state: {
        'S': Object.values(postBody)[0][16]
      },
      employer_zip: {
        'S': Object.values(postBody)[0][17]
      },
      fee: {
        'S': Object.values(postBody)[0][18]
      },
      paid_to: {
        'S': Object.values(postBody)[0][19]
      },
      dob: {
        'S': Object.values(postBody)[0][20]
      },
      ssn: { //'ssn' is primary key for 'teamster-application-database' table; must always be included in 'putItem' method
        'S': Object.values(postBody)[0][21]
      },
      membership: {
        'S': Object.values(postBody)[0][22]
      },
      previous_union_number: {
        'S': Object.values(postBody)[0][23]
      },
    }
  };

  dyn.putItem(params, function (err, data) {
    if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  for (n = 0; n < 24; n++) {
    console.log(Object.values(postBody)[0][n]);
  }

  console.log(postBody);
  console.log(Object.values(postBody)[0]);


});

module.exports = router;