/** @param { Discord.Message } message **/
export const messageOps = ( message, bot ) => {

  const ts = message.createdTimestamp;
  //const r = Math.floor( Math.random() * 2 );

  // --------------------------- REGEX ---------------------------  \\

  if( /16:20|0?4:?20|w[e3]{2,}d/i.test( message.content ) ) {
    message.react( ":blunt:766311145341845504" );
  }
  if( /i('m)?\b.+(really|so|for)\b.+/i.test( message.content ) && ts % 2 === 0 ) {
    message.reply( "yeah same bro" );
  }

  // --------------------------- USER SPECIFIC -------------------------- \\

  if( message.author.id === bot.var.members.kenny && ts % 2 === 0 ) {
    message.react( ts % 8 === 0 ? "<:kenny4:765580912305373184>" : (ts % 6 === 0 ? "<:kenny3:768879445808922624>" : (ts % 4 === 0 ? "<:kenny2:531712859290337290>" : "<:kenny:519211832720883724>")) );
  }

  // --------------------------- TIME STAMPS -------------------------- \\

  if( ts % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    setTimeout( () => {message.react( "\u0039\u20E3" )}, 300 );
    //message.react( "\u0039\u20E3" );
    const filter = ( reaction, user ) => !!reaction.emoji && user.id !== bot.user.id
    message.awaitReactions( filter, { time: 15000 } ).then( (collected) => {
      if( collected.size > 4 ) message.channel.send( "SHUCKS :sweat_drops:" ) 
      else if( collected.size > 0 ) message.channel.send( "YALL ARE EPIC" ) 
    });
  }
  // 0x5f3759df = 99841437 in base ten, there's a slim chance a timestamp can be a multiple of this magic number
  else if( ts % 0x5f3759df === 0 ) { 
    message.reply( "`// what the fuck?` https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );
    message.channel.send( ":pray: ***YOU ARE THE CHOSEN ONE*** :pray:" );
  }

};
