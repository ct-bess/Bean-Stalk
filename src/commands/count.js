import { argHandler } from "../argHandler.js";

//const searchChannels = new Promise( ( resolve, reject ) => {
//});

export default {
  name: "count",
  aliases: [],
  description: "count the amount of times a given user has said a particular word",
  cooldown: {},
  exec( message, bot ) {
    const args = argHandler( message );
    let user = message.author.id;
    let searchExpr = args.get( 1 ) || args.get( 0 );
    let response = "";

    if( args.has( "user" ) ) {
      const argsUser = args.get( "user" );
      if( !/\d{18}/.test( argsUser ) ) {
        // search guild for a username or nickname that matches
      }
      else user = argsUser;
    }


    //message.channel.guild.id
    //const channels = message.channel.guild.channels.cache;
    if( !!searchExpr ) {

      const searchRE = new RegExp( `${searchExpr}`, "i" );
      let tot = 0;

      // 1: grab each channel
      // 2: fetch the messages; save the promises
      // 3: .then().then().then()...finally() ????

      message.channel.guild.channels.cache.forEach( ( value, key ) => {

        console.info( value.name );
        // also check for read messages permission
        if( value.isText() ) {
          value.messages.fetch( { limit: 50 } ).then( messages => {
            const onlyUser = messages.filter( m => m.author.id === user );
            if( !!onlyUser ) {
              onlyUser.forEach( ( msg, k ) => {
                console.debug( "testing:", msg.content );
                if( searchRE.test( msg.content ) ) {
                  ++tot;
                }
              });
              //tot += onlyUser.size;
              console.info( tot );
            }
            //message.reply( `Total ${searchExpr}: ${tot}` );
          });
        }

      });


      message.reply( `Total ${searchExpr}: ${total}` );


      //console.info( tot );
      //message.reply( `Total ${searchExpr}: ${tot}` );

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
