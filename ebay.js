var request = require('request');
// returns random integer from min(inclusive) to max (exclusive)
// used to generate random product category given cost
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// takes in an object and returns a random property from that object
var getRandomObjProperty = function(obj) {
  var numProps = Object.keys(obj).length;
  var randomIndex = getRandomInt(0, numProps);

  return obj[randomIndex];
};

// stores product categories
var categories = {
  house: {
    min: 15000,
    max: 1000000,
    id: 12605
  },
  island: {
    min: 1000000,
    max: 3000000,
    id: 15841
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
};

var getEbayProductCategory = function(cost) {
  var foundCategory = false;
  var tempCategory;
  var categoryId;

  if (cost < 0 ) {
    console.error(cost, 'ERROR: inputted cost is less than 0')
    return null;
  }

  while (!foundCategory) {
    tempCategory = getRandomObjProperty(categories);
    if (tempCategory.min < cost && cost < tempCategory.max) {
      foundCategory = true;
    }
    categoryId = tempCategory.id;
  }

  return categoryId;
};

var getEbayProduct = function(category) {

};