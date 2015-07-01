// Backbone view for the stock submission form
var FormView = Backbone.View.extend({

  className: 'form container',

  divText: '\
      <div class="container"> \
        <div class="row"> \
          <div class="col-sm-4 col-sm-offset-4 well text-center" id="select-form">\
            <form data-toggle="validator" role="form">\
              <div class="form-group"> \
                <label for="symbol">Stock Symbol</label>\
                <input pattern="[a-zA-Z0-9-]{1,6}" style="display:block;" maxlength="6" type="text" id="symbol" class="form-control" data-error="Invalid Stock Ticker" value="AAPL" required autofocus>\
                <div class="error-message help-block with-errors"></div>\
              </div> \
              <div class="form-group"> \
                <label for="date">Date</label>\
                <input pattern="^(?!.*00/).*$" type="date" id="date" class="form-control" data-error="Invalid Date" value="2005-08-10"required>\
                <div class="help-block with-errors">After 1972</div>\
              </div> \
              <div class="form-group"> \
                 <label for="amount">Amount ($)</label>\
                 <input type="number" id="amount" class="form-control" data-error="Invalid amount" value="1000"required>\
                 <div class="help-block with-errors"></div>\
              </div> \
              <button type="submit" class="btn btn-xs submit-button">Submit</button>\
              <img id="spinner" src="assets/images/loader.gif">\
            </form>\
          </div> \
        </div> \
      </div>',

  initialize: function(){
    this.render();
    //stop loading spinner on page load
    this.stopSpinner(); 
    //stop spinner upon request completion
    this.collection.on('sync edited destroy', this.stopSpinner, this);
    this.collection.on('destroy', function() {
      this.$('.error-message').text('Invalid Stock Ticker');
    }, this);
  },

  events: {
    //Form submission form
    'submit': 'handleSubmit',
    'keypress': 'clearErrors',
    //add autocomplete functionality to symbol field on focus
    'focus #symbol': 'autocomplete',
  },

  clearErrors: function(){
    $('.error-message').text('');
  },

  handleDuplicates: function(params) {
    var stocks = this.collection;

    var existingStock = stocks.findStock(params.symbol);
    var startDate = new Date(params.from);
    if (existingStock) {
      if (existingStock.getStartDate() <= startDate) {
          // no need to make an addtional API call; just adds shares to the stock
          // starting with the new start date
          existingStock.addTo(startDate, parseFloat(params.amount));
      } else {
        this.startSpinner();
        // makes API call to get earlier stock history, then updates model
          stocks.getNewStockTrajectory(params).then(function(resp) {
          existingStock.update(resp, parseFloat(params.amount));
        });
      }
      //stop spinner if we did not make API request via CREATE
      this.stopSpinner();
    } else {
      /* Create will create a new stock in the collection
       and send a request for the pertinent information */
      this.collection.create(params);
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    //start spinner upon stock creation
    if (this.$('form')[0].checkValidity()) {
      this.startSpinner(); 
      var d = new Date();
      var requestStock = {
        symbol: this.$('#symbol').val().toUpperCase(),
        from: this.$('#date').val(),
        amount: this.$('#amount').val(),
        to: d.toISOString().slice(0,10) //Just the YYYY-MM-DD portion
      };
      this.handleDuplicates(requestStock);
    } else {
      this.$('form')[0].reset();
    }
    this.$('#symbol').val('');
    this.$('#amount').val('');
  },

  autocomplete: function(){
    console.log("autocomplete called" , this.$("#symbol").css('display'));
    this.$( "#symbol" ).autocomplete({
          source: function( request, response ) {
            console.log("called");
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "YAHOO.Finance.SymbolSuggest.ssCallback",
                data: {
                    query: request.term
                },
                cache: true,
                url: "http://d.yimg.com/autoc.finance.yahoo.com/autoc"
            }); // .ajax
            var YAHOO = window.YAHOO = {Finance: {SymbolSuggest: {}}};
            YAHOO.Finance.SymbolSuggest.ssCallback = function (data) {
              var mapped = $.map(data.ResultSet.Result, function (e, i) {
                    return {
                        label: e.symbol + ' (' + e.name + ')',
                        value: e.symbol
                    };
                });
                response(mapped);
            }; // YAHOO.Finance     
          },
          minLength: 2 // source: function
        }); // autocomplete
  },
  
  startSpinner: function(){
    this.$('#spinner').show();
    this.$('.submit-button').hide();
  },

  stopSpinner: function(){
    this.$('#spinner').hide();
    this.$('.submit-button').show();
  },


  render: function(){
    //Render main form
    return this.$el.html(this.divText);
  }

});
