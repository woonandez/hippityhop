var express = require('express');
var bodyParser = require('body-parser');
var Lyrics = require('./db/schema.js').Lyrics;
var Rhymes = require('./db/schema.js').Rhymes;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log('I am listening to port 1337');
});

// All routes supported for the lyrics endpoint

app.get('/lyrics', function(req, res) {
  Lyrics.find({}).exec((err, lyrics) => {
      res.status(200).send(lyrics)
    });
});

app.post('/lyrics', function(req, res) {
  Lyrics.findOne({ lyric: req.body.lyric }).exec((err, lyric) => {
    if (!lyric) {
      var newLyric = new Lyrics({
        lyric: req.body.lyric
      });
      newLyric.save((err, newLyric) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(201).send(newLyric);
      });
    }
  });
});

app.put('/lyrics', function(req, res) {
  Lyrics.findOne({ _id: req.body._id }).exec((err, lyric) => {
    lyric.lyric = req.body.lyric
    res.status(202).send(lyric);
  });
});

app.delete('/lyrics', function(req, res) {
  Lyrics.findOne({ lyric: req.body.lyric }).remove().exec((err, response) => {
    if (err) {
      throw err;
    }
    res.status(204).send(req.body.lyric);
  });
});