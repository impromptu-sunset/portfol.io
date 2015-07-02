// Backbone model for stocks
var StockModel = Backbone.Model.extend({

  url: '/api/stocks',

  parse: function(response) {
    if (response.length !== 0) {
      this.set('history', response); // "history" is just an array of dates, stock prices, etc
      this.set('amount', parseFloat(this.get('amount')));
      this.set('potential', this.get('amount'));
      var nShares = this.get('amount') / this.get('history')[0].adjClose;
      var max = this.get('amount');
      _.each(this.get('history'), function(snapshot) {
        snapshot.nShares = nShares; // keeps track of number of shares for each data point
        this.saveMax(nShares, snapshot.adjClose);
      }.bind(this));
    } else {
      this.destroy(); // if there is no data, does not add to collection.
    }
  },

  getData: function() {
    return this.get('gameData');
  },

  saveMax: function(shares, adjClose){
    var currentValue = shares * adjClose;
    if(currentValue > this.get('potential')){
      this.set('potential', currentValue);
    }
  },

  getZillow: function(){
    var context = this;
    $.ajax({
      url: '/api/zillow',
      type: 'GET',
      // data: { 
      //   name: this.get('name'),
      // },
      success: function(res) {
        console.log("RESULT IS ",res);
        context.getStreetView(res);
      },
      error: function(error) {
        console.log(error.responseText);
      }
    });
  },

  getStreetView: function(house) {
    var service = new google.maps.StreetViewService();

    var houseLat = house.property.address[0].latitude[0];
    var houseLng = house.property.address[0].longitude[0];

    var houseLatLng = new google.maps.LatLng(houseLat, houseLng);

    var streetViewDistanceRange = 50;

    var panoramaOptions = {
      disableDefaultUI: true,
      scrollwheel: false,
      draggable: false,
      visible: false,
    };

    var panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama-box'), panoramaOptions);

    service.getPanoramaByLocation(houseLatLng, streetViewDistanceRange, function(panoData, status) {
      if(status === google.maps.StreetViewStatus.OK){
        var carLatLng = panoData.location.latLng;

        var heading = google.maps.geometry.spherical.computeHeading(carLatLng, houseLatLng);
        console.log(heading);
        console.log(panoData, status);
        panorama.setPano(panoData.location.pano);
        panorama.setPov({
             heading: heading,
              zoom: 1,
              pitch: 0
          });
        panorama.setVisible(true);
      }
      else {
        console.error('ERROR: panorama does not exist at that location');
      }
    });

  },
  /* given an index or date, returns the value of user's stock at that time
  * using the stock's closing value as the value for that day
  */
  getValue: function(indexOrDate) {
    var history = this.get('history');
    if (typeof indexOrDate === 'number') {
      return history[indexOrDate].adjClose * history[indexOrDate].nShares; // scaling factor
    } else {
      var snapshot = _.findWhere(history, {date: indexOrDate});
      if (!snapshot) {
        return null;
      } else {
        return snapshot.adjClose * snapshot.nShares;
      }
    }
  },

  // adds previous history to an existing stock
  update: function(history, amount){
    var context = this;
    var nShares = amount / history[0].adjClose;

    // updates new and existing history with number of shares

    _.each(history, function(snapshot) {
      snapshot.nShares = nShares;
    });
    _.each(this.get('history'), function(snapshot) {
      snapshot.nShares += nShares; // updates old data points with extra shares
    }.bind(this));

    // first index of the stock history where there's overlap
    var existingIndex = _.findIndex(history, function(snapshot) {
      return (new Date(snapshot.date) >= context.getStartDate());
    });

    // concatenate stock histories
    var earlyHistory = history.slice(0, existingIndex);
    var updatedHistory = earlyHistory.concat(this.get('history'));
    this.set('history', updatedHistory);

     _.each(this.get('history'), function(snapshot) {
      this.saveMax(snapshot.nShares, snapshot.adjClose);
    }.bind(this));

    this.set('amount', this.get('amount') + amount); // total amount invested in this stock
    this.trigger('edited', this); // alerts views to rerender
  },

  // adds shares to existing stock with a complete history
  addTo: function(startDate, amount) {
    this.set('amount', this.get('amount') + amount);
    var context = this;
    startDate = new Date(startDate);
    var firstExisting = _.find(this.get('history'), function(snapshot) {
      return (startDate <= new Date(snapshot.date));
    });
    var nShares = amount / firstExisting.adjClose;
    _.each(this.get('history'), function(snapshot) {
      var date = new Date(snapshot.date);
      if (startDate <= date) {
        snapshot.nShares = snapshot.nShares + nShares;
      }
      this.saveMax(snapshot.nShares, snapshot.adjClose);
    }.bind(this));
    this.trigger('edited', this);
  },

  // may not be needed
  getStartDate: function() {
    return new Date(this.get('history')[0].date);
  },

  // the last date for which we have data (should be close to now)
  getEndDate: function() {
    var history = this.get('history');
    return new Date(history[history.length - 1].date);
  },

  // the value of the stock at purchase time
  getStartVal: function() {
    return this.get('amount');
  },

  // the value of the stock at the end of the trajectory
  getEndVal: function() {
    return this.getValue(this.get('history').length - 1);
  },

  // get the max value of the stock
  getMaxVal: function() {
    var traj = this.getTrajectory();
    var maxSnapshot = _.max(traj, function(snapshot) {
      return snapshot.value;
    });
    return maxSnapshot.value;
  },

  // get the min value of the stock
  getMinVal: function() {
    var traj = this.getTrajectory();
    var minSnapshot = _.min(traj, function(snapshot) {
      return snapshot.value;
    });
    return minSnapshot.value;
  },


  // returns the stock's history in d3-consumable format
  getTrajectory: function() {
    var context = this;
    return _.map(this.get('history'), function(snapshot, index) {
      var values = {};
      values.date = new Date(snapshot.date);
      values.value = context.getValue(index);
      values.symbol = snapshot.symbol;
      return values;
    });
  },


});
