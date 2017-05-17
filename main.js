"use strict";

var searchKey = require('./config.json').key;

function random ( n ) { return Math.round(Math.random() * n); };

function chckentities ( tweet, user ){
  let regex = new RegExp('^'+user);
  let hs = tweet.entities.hashtags;
  for(let i=0, l=hs.length; i< l; i++){
    if(regex.test(hs[i].text.toLowerCase()) ) return true;
  }
  let us = tweet.entities.user_mentions;
  for(let i=0, l=us.length; i< l; i++){
    if(us[i].screen_name.toLowerCase() == user) return true;
  }
  return false;
}

const Twit = require('twit');

const T = new Twit(require('./config.json').login );

var stream = T.stream('statuses/filter',{
  follow: require('./config.json').follow,
});

stream.on('tweet', tweet => {
  if(tweet.in_reply_to_status_id) return;
  if(tweet.retweeted_status) return;
  if(!chckentities(tweet, require('./config.json').key)) return;

  setTimeout( ()=> {
    T.post('statuses/retweet/:id', { id: tweet.id_str })
    .catch( err => console.log('ERR:', err))
    .then( (data, response) => {
      console.log('RT', tweet.id, '=>', data.data.id);
    });
  }, 1000 + random(10000));

});

var targets = [searchKey, searchKey+'4', searchKey+'5'];
var stream2 = T.stream('statuses/filter', {
  track: targets
});

stream2.on('tweet', tweet => {
  setTimeout( ()=> {
    T.post('favorites/create', { id: tweet.id_str })
    .catch( err => console.log("ERR", err, '\n') )
    .then( (data, res) => console.log('FAV', data.data.id, '\n') );
  }, random(5000));
});
