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

const T = new Twit(require('./config.json'));

var stream = T.stream('statuses/filter', { follow: ['85646556', '160571292', '90886814'] });

stream.on('tweet', tweet => {
  if(tweet.in_reply_to_status_id) return;
  if(tweet.retweeted_status) return;
  if(!chckentities(tweet, 'startrespodcast')) 
    return console.log('Tweet so close to retweet:\n', tweet);
  
  setTimeout( ()=> {
    T.post('statuses/retweet/:id', { id: tweet.id_str }, 
    (err, data, response) => {
      if(err) return console.log('ERR:', err);
      console.log('Retweeted', tweet.id, '=>', data.id, '\n');
    });
  }, 1000 + random(10000));
    
});
