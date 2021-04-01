import { argHandler } from "../argHandler.js";

export default {
  name: "count",
  aliases: [],
  description: "count the amount of times a given user has said a particular word",
  cooldown: {},
  exec( message, bot ) {
    const args = argHandler( message );
    let user = null;
    let searchExpr = args.get( 1 ) || args.get( 0 );
    let response = "";

    // to fetch all messages:
    // 1: limit: 100, before: channel.lastMessageID
    // 2: limit: 100, before: prevLastMessageID
    // ...
    // make sure you process them, then overwrite the previous so we dont make a uge buffer

    if( args.has( "user" ) ) {
      const argsUser = args.get( "user" );
      if( !/\d{18}/.test( argsUser ) ) {
        // search guild for a username or nickname that matches
      }
      else user = argsUser;
    }
    else if( args.has( "me" ) ) user = message.author.id;


    if( !!searchExpr ) {

      const searchRE = new RegExp( `${searchExpr}`, "i" );
      const fetchedChannels = [];
      let tot = 0;

      // cache --> may not be all channels
      message.channel.guild.channels.cache.forEach( ( value, key ) => {

        //console.info( value.name );
        // also check for read messages permission
        if( value.isText() ) {
          // limit: 1 to 100; else crash
          fetchedChannels.push( value.messages.fetch( { limit: 100 } ) );
        }

      });

      // I get the feeling there's gonna be too much data stored in a buffer
      Promise.all( fetchedChannels ).then( messages => {
        for( let msg of messages ) {

          if( !!user ) msg = msg.filter( m => m.author.id === user );

          if( !!msg ) {
            msg.forEach( ( m, k ) => {
              //console.debug( "testing:", m.content );
              if( searchRE.test( m.content ) ) {
                ++tot;
              }
            });
            //console.info( "total:", tot );
          }
        }
        message.reply( `Total \`${searchExpr}\`'s from the past 100 messages in each channel: **${tot}** ${!!user ? "" : "(everyone)"}` );
      });

    }
    else {
      response = "no expression given to search with";
    }

    if( response.length > 0 && response.length < 2000 ) message.channel.send( response );

  }, // EO exec
  refresh( user ) {
    if( !!user ) {
      if( !!this.cooldown[user] ) delete this.cooldown[user];
    }
    else {
      this.cooldown = {};
    }
  }
};
