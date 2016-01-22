/**
 * Created by Vunb on 1.22.2016.
 */
var streamForward = require('stream-forward')
  , queryString = require('query-string')
  , request = require('request')
  ;


module.exports = {
  forward: function (req, res) {
    var linkTarget = req.param('target');
    var opts = {
      events: ['complete']
    };
    streamForward(request(linkTarget), opts)
      .pipe(res)
      .on('complete', function () {
        // Called.
        sails.log.info('Forwarded to', linkTarget);
      });

  },


  openWeatherMap: function (req, res) {
    var path = req.param('path');
    var subPath = req.param('subPath');
    var query = queryString.stringify(req.query);
    var linkTarget = 'http://api.openweathermap.org/data/2.5/' + path + '/' + subPath + '?' + query
      , opts = {
        events: ['complete']
      };

    var sourceRequest = request(linkTarget);
    streamForward(sourceRequest, opts)
      .pipe(res)
      .on('complete', function () {
        // Called.
        sails.log.info('Forwarded to', linkTarget);
      });
  }
};
