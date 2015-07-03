
var items = {
  taco: {
    description: 'jack in the box tacos',
    price: 0.50
  },
  theobromine: {
    description: 'lethal doses of chocolate for the average american male',
    price: 1440,
  },
  twizzler: {
    description: 'twizzlers',
    price: 0.05,
  },
  cheeto: {
    description: 'cheetos',
    price: 0.03,
  },
  footlong: {
    description: 'subway footlongs',
    price: 5.00,
    length: 1 // feet
  },
  airJordan: {
    description: 'kg of air jordan XX3 Mens 10US shoes',
    price: 225.00,
    weight: 0.393, // kg
  },
  tesla: {
    description: 'tesla model s cars',
    price: 80000.00,
  },
  manhattanland: {
    description: 'square feet in upper west side manhattan',
    price: 1600.00
  },
  star: {
    description: 'star name certificates',
    price: 54.00
  },
  toKillAMockingbird: {
    description: 'new paperback copies of to kill a mockingbird',
    price: 4.94
  },
  harryPotterAudioCD: {
    description: "CD versions of harry potter and the sorcerer's stone audiobook",
    price: 24.43
  },
  horse: {
    description: 'hours of owning a horse',
    price: 1.37
  }

};

// returns random integer from min(inclusive) to max (exclusive)
// used to generate random product category given cost
// used for generating a random index in an array
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

var getRandomItem = function(cost) {

  var item = {};

  // while there is no item quantity, or the item quantity is 0 because the price was higher than the cost
  while (!item.quantity) {
    // get a random item
    item = getRandomObjProperty(items);
    // determine the quantity of the items that can be purchased
    item.quantity = Math.round(cost / item.price);
  }


  return item;

};

module.exports.getRandomItem = getRandomItem;