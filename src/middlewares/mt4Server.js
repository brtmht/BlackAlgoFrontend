const config = require('../config/config');

var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://3.235.241.65:30400/Connect?user=500476959&password=ehj4bod&host=mt4-demo.roboforex.com&port=443',
  headers: { 
    'accept': 'text/plain'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});