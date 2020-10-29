/** @param { Discord.Message } message **/
export const messageOps = ( message ) => {

  // --------------------------- REGEX ---------------------------  \\

  if( /16:20|0?4:?20|w[e3]{2,}d/i.test( message.content ) ) {
    message.react( ":blunt:766311145341845504" );
  }
  //         |and?
  if( /i\b.+(so|for)\b.+/i.test( message.content ) ) {
    message.reply( "yeah same bro" );
  }

  // --------------------------- TIME STAMPS -------------------------- \\

  if( message.createdTimestamp % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    message.react( "\u0039\u20E3" );
  }
  // 0x5f3759df = 99841437 in base ten, there's a slim chance a timestamp can be a multiple of this magic number
  else if( message.createdTimestamp % 0x5f3759df === 0 ) { 
    message.reply( "`// what the fuck?` https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );
    message.channel.send( ":pray: ***YOU ARE THE CHOSEN ONE*** :pray:" );
  }

};
