export default {
  name: "grantspeak",
  aliases: [ "grant" ],
  description: "Styles a message into a dot XXX rated Grant MacDonald message",
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/, 2 );
    args.shift();

    let response = "";

    if( args.length > 0 ) {
      response = message.content.replace( /-grant|-grantspeak/i, "" );
    }
    else {
      const latestMessage = message.channel.messages.last( 2 );
      response = latestMessage[0].content;
    }

    console.debug( "Using:", response );
    response = response.toUpperCase();

    response = response.replace( /[.,]\B/g, " ... " );
    response = response.replace( /[?!]\B/g, " ! " );

    // WE ALSO INCLUDED AN ADVANCED AI SYSTEM
    // SO WE HAVE FISH THAT MOVE AWAY WHEN YOU SWIM CLOSE TO THEM
    if( /thank|love|awesome|great|thnx|shucks|damn|TY|XXX|dang|nice/i.test( message.content ) ) { 

      if( message.createdTimestamp % 2 === 0 ) {
        response += " HONORED";
        if( message.createdTimestamp % 4 === 0 ) response += " BY YOU";
      }
      else {
        response += " ... SHUCKS"
        if( message.createdTimestamp % 3 === 0 ) response += " THNX";
        if( message.createdTimestamp % 7 === 0 ) response += " DAMN";
      }

      if( message.createdTimestamp % 5 === 0 ) response += " LOVE MY SUPER COOL FANS";

    }

    if( message.createdTimestamp % 6 === 0 ) response += " DOT XXX";
    if( message.createdTimestamp % 5 === 0 ) response += " ... BRILLIANT";
    if( message.createdTimestamp % 11 === 0 ) response += " SMART GUY ...";

    message.channel.send( response );

  }
}
