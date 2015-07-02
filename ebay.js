var request = require('request');

// stores product categories
// find new product category IDs at: http://www.isoldwhat.com/getcats/
var categories = {
  house: {
    min: 15000,
    max: 10000000,
    id: 12605
  },
  island: {
    min: 1000000,
    max: 3000000,
    id: 15841,
    keyword: 'island'
  },
  boat: {
    min: 5000,
    max: 800000,
    id: 26429
  },
  wristwatch: {
    min: 0,
    max: 300000,
    id: 14324
  },
  car: {
    min: 1000,
    max: 800000,
    id: 6001
  },
  collectibles: {
    min: 0,
    max: 1000000,
    id: 1
  },
  homeAndGarden: {
    min: 10,
    max: 20000,
    id: 11700
  },
  fossils: {
    min: 5, 
    max: 50000,
    id: 3213
  }
};

// returns random integer from min(inclusive) to max (exclusive)
// used to generate random product category given cost
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// takes in an object and returns a random property from that object
var getRandomObjProperty = function(obj) {
  var keys = Object.keys(obj);
  var numProps = keys.length;
  var randomIndex = getRandomInt(0, numProps);
  return obj[keys[randomIndex]];
};

var getEbayProductCategory = function(cost) {
  var foundCategory = false;
  var tempCategory;
  var category;

  console.log('COST IS ', cost);

  if (cost < 0 ) {
    console.error(cost, 'ERROR: inputted cost is less than 0');
    return null;
  }

  if (cost > 10000000) {
    console.log('cost too high, returning house');
    return categories.house;
  }

  while (!foundCategory) {
    tempCategory = getRandomObjProperty(categories);
    if (tempCategory.min <= cost && cost <= tempCategory.max) {
      foundCategory = true;
    }
    category = tempCategory;
  }

  return category;
};

var getEbayProduct = function(req, res) {

  var cost = req.body.cost;
  var category;


  if (typeof cost !== 'number') {
    res.send(500, { error: "must send a number to find ebay product" });
  }
  

  category = getEbayProductCategory(cost);

  // DEBUG TO TEST SPECIFIC CATEGORIES:
  // category = categories.homeAndGarden;
  if (!category) {
    res.send(500, { error: "unable to find a category" });
  }

  var categoryId = category.id;
  var keyword = category.keyword || null;

  var requestUrl = 
          'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced' +
          '&SERVICE-VERSION=1.12.0' +
          '&SECURITY-APPNAME=Jonathan-3653-441d-a058-edbde13c5f5c' +
          '&RESPONSE-DATA-FORMAT=JSON' +
          '&REST-PAYLOAD' +
          '&paginationInput.entriesPerPage=1' +
          '&categoryId=' + categoryId +
          '&sortOrder=CurrentPriceHighest' +
          '&itemFilter(0).name=MaxPrice' +
          '&itemFilter(0).value=' + cost
          ;

  // if the request requires a keyword
  if (keyword) {
    // add the keyword to the end
    requestUrl += '&keywords=' + keyword;
  }

  request(requestUrl, function(error, ebayRes, ebayData) {
    // TODO: send the first item in the response array which will be the highest price item
    res.send(ebayData);
  });
};

module.exports.getEbayProduct = getEbayProduct;