#!/usr/bin/node

const utf8 = require("utf8");
const csv = require("csv-parser");
const moment = require('moment-timezone');
var csvWriter = require('csv-write-stream');
var writer = csvWriter({ headers: ["Timestamp","Address","ZIP","FullName",
  "FooDuration","BarDuration","TotalDuration","Notes"]});

const UnicodeReplacementCharacter = utf8.decode("\xEF\xBF\xBD");

const nonUtf8Regex = /((?:[\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}){1,})|./g;

String.prototype.clean = function() {
  if (this.search(nonUtf8Regex) !== -1) {
    var s = this.replace(nonUtf8Regex, "$1" + UnicodeReplacementCharacter);
    return s.substring(0, s.length -1); // Need to trim off extra character
  } else {
    return this;
  }
}

String.prototype.zeroPad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

writer.pipe(process.stdout)

process.stdin
.pipe(csv())
  .on('data', (data) => {
    const converted = {};
    try {
      converted["Timestamp"] = moment(data["Timestamp"], "M/D/YY H:mm:ss A")
        .tz('America/New_York').format("YYYY-MM-DD HH:mm Z");
      converted["FullName"] = data["FullName"].clean().toUpperCase();
      converted["Address"] = data["Address"].clean();
      converted["ZIP"] = data["ZIP"].zeroPad(5);
      converted["FooDuration"] = moment
        .duration(data["FooDuration"], "HH:MM:SS.MS").asMilliseconds() / 1000;
      converted["BarDuration"] = moment
        .duration(data["BarDuration"], "HH:MM:SS.MS").asMilliseconds() / 1000;
      converted["TotalDuration"] = converted["FooDuration"] 
        + converted["BarDuration"];
      converted["Notes"] = data["Notes"].clean();
      writer.write(converted);
    } catch (e) {
      console.erorr("Could not convert data:\n" + data, e);
    }
  }).on('end', () => {
    writer.end();
  });