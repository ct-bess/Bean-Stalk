import { argHandler } from "../argHandler.js";

export default {
  name: "yeet",
  aliases: [],
  description: "yeet a message to another channel; Defaults to a random channel in the Bean cache",
  exec( message, bot ) {
    const args = argHandler( message );

    let channel = bot.channels.cache.random().id;
    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
    }

    if( args.has( 0 ) ) {
      const arg0 = args.get( 0 );
      if( arg0.startsWith( "<#" && arg0.endsWith( ">" ) ) ) {
        channel = arg0.substring( 2, arg0.length - 1 );
      }
    }

    console.debug( channel );

    if( bot.channels.cache.has( channel ) ) {
      try {

        let m = "";
        if( !args.has( 0 ) && !args.has( "channel" ) ) m = message.channel.messages.cache.last( 2 )[0].content;
        else m = args.get( "message" ) || ( args.has( 1 ) ? ( args.get( 0 ) + " " + args.get( 1 ) ) : args.get( 0 ) );

        do {
          const actualChannel = bot.channels.resolve( channel );

          const perm = actualChannel.permissionsFor( bot.user.id );
          console.info( perm.bitfield & 0x800 );

          const validChannel = actualChannel.isText() && (perm.bitfield & 0x800 === 0x800);

          if( validChannel ) {
            actualChannel.send( m );
            //console.info( m );
            break;
          }
          channel = bot.channels.cache.random().id;
        } while( !validChannel && m.length > 0 )
      } catch( error ) {
        console.error( error );
      }

    }
    else {
      message.reply( "aint got no channel" );
    }

  } // EO exec
};
