import { argHandler, coalesce } from "../commandUtil.js";

export default {
  name: "yeet",
  aliases: [],
  description: "yeet a message to another channel; Defaults to a random channel in the Bean cache",
  exec( message, bot ) {
    const args = argHandler( message );

    let channel = null;
    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      channel = coalesce( channel, "channel", bot, null );
    }
    else channel = bot.channels.cache.random();

    if( !!channel ) {
      let iterations = 0;
      try {

        let m = "", validChannel = false;
        // since we're using the channel's message cache i'm guessing if it aint primed then we'll be yeeting the -yeet message
        if( !args.has( 0 ) ) m = message.channel.messages.cache.last( 2 )[0].content;
        else m = args.get( "message" ) || ( args.has( 1 ) ? ( args.get( 0 ) + " " + args.get( 1 ) ) : args.get( 0 ) );

        do {
          const perm = channel.permissionsFor( bot.user.id );
          validChannel = channel.isText() && perm.has( "SEND_MESSAGES" ); //(perm.bitfield & 0x800 === 0x800);

          if( validChannel ) {
            channel.send( m );
            break;
          }
          channel = bot.channels.cache.random();
          ++iterations;

        } while( !validChannel && m.length > 0 && iterations < 69 )

      } catch( error ) {
        console.error( error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }

  } // EO exec
};
