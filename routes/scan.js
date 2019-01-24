var express = require('express');
var router = express.Router();

/* GET scan page. */
// '/scan' is automatically assumed for '/'
router.get('/', function (req, res, next) {
  res.render('scan', {
    title: 'DatabaseSearch'
  })
  console.log('inside of router.get')
});

//'/scan/results' is automatically assumed for '/results', so in scan.hbs, we have to send POST request
//to /scan/results ... confusing, but critical to understand.
router.post('/results', function (req, res, next) {
  const postBody = req.body; //request.body is made by bodyparser.urlencoded, which parses the http message for sent data

  console.log(postBody);
  console.log(postBody["lname"]);
  console.log(postBody["fname"]);

  /**scan and filter table******************************************************************************** */
  var AWS = require('aws-sdk');
  var dyn = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
  });

  var filterExpArray = []; // base array that holds POST data (input from html form) for FilterExpression

  var filterExpString = []; //one element array that holds string for FilterExpression

  var lname_exp;
  var fname_exp;


  if (postBody["lname"] !== '') { //if data input in html form not empty, push string for FilterExpression to filterExpArray
    lname_exp = "#last_name = :lname";
    filterExpArray.push(lname_exp);
  };
  if (postBody["fname"] !== '') {
    fname_exp = "#first_name = :fname";
    filterExpArray.push(fname_exp);
  };

  console.log('filterExpArray.length =' + filterExpArray.length)

  if (filterExpArray.length > 1) {
    for (n = 0; n < (filterExpArray.length - 1); n++) {
      //add " AND " to each element in array, exept last
      filterExpArray.splice(n, 1, (filterExpArray[n] + " AND "));
    }
  }

  console.log('filterExpArray = ' + filterExpArray);

  function filterExpFunc() {
    if (filterExpArray.length == 1) {
      var fE = filterExpArray[0];
      filterExpString.push(fE);
    } else {
      if (filterExpArray.length > 1) {
        for (m = 0; m < filterExpArray.length - 1; m++) {
          var fE = filterExpArray[m] += filterExpArray[m + 1];
          filterExpString.push(fE)
        }
      }
    }

    console.log('fE = ' + fE);
    console.log('filterExpString = ' + filterExpString);
  }

  filterExpFunc();
  //console.log('filterExp = '+fE);

  {
    var params = {
      TableName: 'teamster-application-database',
      /* required */
      ExpressionAttributeNames: {
        //"#last_name": Object.keys(postBody)[0], //lname
        //"#first_name": Object.keys(postBody)[1] //fname
      },
      ExpressionAttributeValues: {
        //":lname": {
        //  "S": Object.values(postBody)[0] //Smith
        //},
        //":fname": {
        //  "S": Object.values(postBody)[1] //John
        //},
      },
      FilterExpression: filterExpString[0]
    };

    if (postBody["lname"] !== '') {
      params["ExpressionAttributeNames"]["#last_name"] = Object.keys(postBody)[0]
    };
    if (postBody["fname"] !== '') {
      params["ExpressionAttributeNames"]["#first_name"] = Object.keys(postBody)[1]
    };
    if (postBody["lname"] !== '') {
      params["ExpressionAttributeValues"][":lname"] = {
        "S": Object.values(postBody)[0]
      }
    };
    if (postBody["fname"] !== '') {
      params["ExpressionAttributeValues"][":fname"] = {
        "S": Object.values(postBody)[1]
      }
    };

    console.log('params["ExpressionAttributeValues"] = ' + params["ExpressionAttributeValues"]); //{ ':lname': { S: 'Smith' }, ':fname': { S: 'John' } }
    console.log('params["ExpressionAttributeNames"] = ' + params["ExpressionAttributeNames"]); //{ '#last_name': 'lname', '#first_name': 'fname' }
    console.log('params["FilterExpression"] = ' + params["FilterExpression"]);
    console.log('params = ' + params); //{ '#last_name': 'lname', '#first_name': 'fname' }


    dyn.scan(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      //else console.log(data); // successful response --logs entire data object
      console.log(data.Items);
      
      res.send(data.Items); //sends results of scan & filter back to client (scan-filter.html)
      });
    /**scan and filter table******************************************************************************** */
  }
});

module.exports = router;