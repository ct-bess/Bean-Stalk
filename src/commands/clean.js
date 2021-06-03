import { argHandler } from "../util/commandUtil";

export default {
  name: "clean",
  aliases: [ "purge" ],
  description: "Clears up duplicate bot messages",
  exec( message, bot ) {
    const args = argHandler( message );
    const everyone = args.has( "everyone" );
    let response = "";

    if( args.has( "yes" ) && args.has( "do" ) && args.has( "it" ) && args.has( "PLEASE" ) && bot.var.admins.includes( message.author.id ) ) {

      // cache --> may not be all channels
      message.channel.guild.channels.cache.forEach( ( value, key ) => {

        if( value.isText() ) {
          // limit: 1 to 100; else crash
          value.messages.fetch( { limit: 100 } ).then( messages => {
            let i = 0;
            let deleted = [];
            console.info( `fetched ${messages.size} messages from ${value.name}` );
            messages.forEach( ( m1, k1 ) => {
              messages.forEach( ( m2, k2 ) => {
                if( k2 !== k1 && !deleted.includes( k1 ) && (m1.author.bot || everyone) && m1.content === m2.content ) {
                  ++i;
                  deleted.push( k1 );
                  setTimeout( () => {
                    m1.delete( { reason: "bruh" } ).then( m => { console.info( `Deleting message by ${m.author.username} from ${m.channel.name}` ) }).catch( console.error );
                  }, i*1500 )
                }
              });
              

            });

          });

        }

      });

    }

    if( response.length > 0 && response.length < 2000 ) message.channel.send( response );

  } // EO exec
};

