import { argHandler, coalesce } from "../commandUtil.js";

// this is basically yeet but we default to the current channel
export default {
  name: "echo",
  aliases: [],
  description: "bro",
  exec( message, bot ) {
    const args = argHandler( message );

    let channel = message.channel;
    let delay = args.get( "delay" ) || 0;
    delay = parseInt( delay ) * 1000;

    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      channel = coalesce( channel, "channel", bot, null );
    }

    if( !!channel ) {
      try {

        let m = "", validChannel = false;
        if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
        else m = args.get( "message" ) || ( args.has( 1 ) ? ( args.get( 0 ) + " " + args.get( 1 ) ) : args.get( 0 ) );

        const perm = channel.permissionsFor( bot.user.id );

        validChannel = channel.isText() && perm.has( "SEND_MESSAGES" );

        if( validChannel && m.length > 0 ) {
          if( delay > 0 ) {
            setTimeout( () => { 
              // DYNAMIC GAMEPLAY
              if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
              channel.send( m || "bruh" ) 
            }, delay );
          }
          else channel.send( m );
        }

      } catch( error ) {
        console.error( error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }

  } // EO exec
};

