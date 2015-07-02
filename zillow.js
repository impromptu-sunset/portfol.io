//include yahooFinance npm module
var Zillow = require('node-zillow');
 
 // move to env variable before pushing
var zwsid = 'X1-ZWz1a6ntkoonij_5w3uy';
//Instantiate 

// var 100k = [
//   {
//     zpid: ''
//   },
//   {
//     address: 'Fleur de Lys',
//     citystatezip: '90077'
//   }
// ];

var addresses = {
  cheap: {
    address: '230 sea cliff ave',
    citystatezip: '94121'
  }
};

var zillow = new Zillow(zwsid);
//3uy&address=725+5th+ave&citystatezip=10022
var getSearchResults = function(req,res) {
  // use npm yahooFinance library function to instantiate stock request
  //var parameters = addresses[req.query.type];
  var parameters = addresses['cheap'];
  zillow.callApi('GetSearchResults', parameters)
    .then(function(data) {
      var result = data.response[0].results[0].result[0];
      var pid = result.zpid;
      console.log("PID is ",pid);
      res.send({property: result});
    });

};

module.exports.getSearchResults = getSearchResults;