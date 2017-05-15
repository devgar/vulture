"use strict";

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

var stream = T.stream('statuses/filter', { follow: require('./config.json').follow });

stream.on('tweet', tweet => {
  if(tweet.in_reply_to_status_id) return;
  if(tweet.retweeted_status) return;
  if(!chckentities(tweet, require('./config.json').key)) return;

  setTimeout( ()=> {
    T.post('statuses/retweet/:id', { id: tweet.id_str },
    (err, data, response) => {
      if(err) return console.log('ERR:', err);
      console.log('Retweeted', tweet.id, '=>', data.id, '\n');
    });
  }, 1000 + random(10000));

});
