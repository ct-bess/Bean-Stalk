import { argHandler } from "../argHandler.js";
export default {
  name: "collect",
  aliases: [ "succ" ],
  description: "Add a message collector for the specified text channel",
  exec( message, bot ) {
    const args = argHandler( message );

    let channel = null;
    if( args.has( "channel" ) ) {
      channel = args.get( "channel" );
      if( channel.startsWith( "<#" && channel.endsWith( ">" ) ) ) {
        channel = channel.substring( 2, channel.length - 1 );
      }
    }
    else {
      // bro
      channel = message.channel.id;//bot.var.channels.commands;//bot.channels.cache.random();
    }

    if( bot.channels.cache.has( channel ) ) {
      const time = args.get( "time" ) || "1m";
      const type = time.substring( time.length, time.length-1 ).toLowerCase();
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

      bot.channels.resolve( channel ).awaitMessages( filter, { time: period } ).then( collected => {
        // todo: other collector finishing options
        let summary = "";
        collected.forEach( message => {
          const words = message.content.split(" ");
          summary += (words[ Math.floor( Math.random() * words.length ) || 0 ] + " ") || "";
        });
        if( summary.length > 0 ) bot.channels.resolve( channel ).send( summary );
      });

    } // EO valid channel
    else {
      console.warn( "No channel?" );
    }

  } // EO exec
};
