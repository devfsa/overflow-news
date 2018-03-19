function load(RSSFile, callback) {
    const fs = require('fs');

    fs.readFile(RSSFile, function (error, data) {
        if (error) {
            console.log('\x1b[31m[ERROR]\x1b[0m', error.message);
            callback(error);
        } else {
            const xml2js = require('xml2js');
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

                const Feed = require('../models/feed');
                Feed.insertMany(feeds, { ordered: false }, function (error) {
                    if (error) {
                        console.log('\x1b[34m[INFO]\x1b[0m', `${feeds.length} feeds found, ${feeds.length - error.writeErrors.length} inserted`);
                    } else {
                        console.log('\x1b[32m[SUCCESS]\x1b[0m', `${feeds.length} feeds inserted`);
                    }

                    callback(null);
                });
            });
        }
    });
}

module.exports = {
    load
};