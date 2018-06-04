const fs = require('fs');
const xml2js = require('xml2js');
const Feed = require('../models/feed');

function load(RSSFile, callback) {
  fs.readFile(RSSFile, function (error, data) {
    if (error) {
      return callback(error);
    }

    const parser = new xml2js.Parser();

    parser.parseString(data, function (error, result) {
      const feedsToParse = result.opml.body[0].outline[0].outline;
      const feeds = feedsToParse.map(function (feed) {
        return {
          title: feed['$']['title'],
          url: feed['$']['htmlUrl'],
          rss: feed['$']['xmlUrl']
        };
      });

      Feed.insertMany(feeds, { ordered: false }, function (error) {
        if (error && error['writeErrors'].length === 0) {
          return callback(error);
        }

        callback(null);
      });
    });
  });
}

module.exports = { load };