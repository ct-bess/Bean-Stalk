/** @param { Discord.Message } message **/
export const messageOps = ( message ) => {

  const ts = message.createdTimestamp;
  //const r = Math.floor( Math.random() * 2 );

  // --------------------------- REGEX ---------------------------  \\

  if( /16:20|0?4:?20|w[e3]{2,}d/i.test( message.content ) ) {
    message.react( ":blunt:766311145341845504" );
  }
  if( /i('m)?\b.+(really|so|for)\b.+/i.test( message.content ) ) {
    message.reply( "yeah same bro" );
  }

  // --------------------------- USER SPECIFIC -------------------------- \\

  if( message.author.username.toLowerCase() === "diekommissar" && ts % 2 === 0 ) {
    message.react( ts % 8 === 0 ? "<:kenny4:765580912305373184>" : (ts % 6 === 0 ? "<:kenny3:768879445808922624>" : (ts % 4 === 0 ? "<:kenny2:531712859290337290>" : "<:kenny:519211832720883724>")) );
  }

  // --------------------------- TIME STAMPS -------------------------- \\

  if( ts % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    message.react( "\u0039\u20E3" );
  }
  // 0x5f3759df = 99841437 in base ten, there's a slim chance a timestamp can be a multiple of this magic number
  else if( ts % 0x5f3759df === 0 ) { 
    message.reply( "`// what the fuck?` https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );
    message.channel.send( ":pray: ***YOU ARE THE CHOSEN ONE*** :pray:" );
  }

};
