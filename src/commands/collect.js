import { argHandler, coalesce } from "../util/commandUtil";
import { createDigraphs, generateSentence } from "../util/digraphUtil";

export default {
  name: "collect",
  aliases: [ "succ" ],
  description: "Add a message collector for the specified text channel",
  exec( message, bot ) {
    const args = argHandler( message );

    let channel = null;
    if( args.has( "channel" ) || args.has( 1 ) ) {

      channel = args.get( "channel" ) || args.get( 1 );
      if( channel.startsWith( "<#" && channel.endsWith( ">" ) ) ) {
        channel = channel.substring( 2, channel.length - 1 );
      }
      channel = coalesce( channel, "channel", bot, null );

    }
    else {
      channel = message.channel;
    }

    if( !!channel ) {
      const time = args.get( "time" ) || "1m";
      const type = time.substring( time.length, time.length-1 ).toLowerCase();
      const useDigraphs = args.has( "digraphs" );
      let period = parseInt( time.substring( 0, time.length-1 ) );
      switch( type ) {
        case "m":
          period *= 60;
        case "s":
          period *= 1000;
        default:
          period %= 600000;
      }
      console.info( "using time period (milliseconds):", period, "from type:", type );

      // todo: filters by variable
      const filter = message => !!message.content;

      channel.awaitMessages( filter, { time: period } ).then( collected => {
        // todo: other collector finishing options
        let summary = "";
        let words = [];
        collected.forEach( message => {
          const messageWords = message.content.split(" ");
          if( useDigraphs ) words = [ ...words, ...messageWords ];
          else summary += (messageWords[ Math.floor( Math.random() * messageWords.length ) || 0 ] + " ") || "";
        });

        if( useDigraphs ) {
          const size = Math.floor( Math.random() * 12 ) + 3;
          const digraphs = createDigraphs( words );
          summary = generateSentence( digraphs, size ) || "";
        }

        if( summary.length > 0 && summary.length < 2000 ) channel.send( summary );
      });

    } // EO valid channel
    else {
      console.warn( "Invalid channel given to collect" );
    }

  } // EO exec
};
