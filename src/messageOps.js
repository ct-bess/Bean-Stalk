const sameBroRE = /i(?:'?m)?\s.*(love|just|for|really|look)\s(\w+)/i;

/** 
 * @method messageOps
 * @description runs a message through a gauntlet of horrible inside jokes and makes the client respond accordingly
 * * @param { Discord.Message } message the message origin
 * * @param { Discord.Client } bot client processing the message
 * * @returns { void }
 * **/
export const messageOps = ( message, bot ) => {

  const ts = message.createdTimestamp;
  //const r = Math.floor( Math.random() * 2 );

  if( message.content === "S" ) {
    message.channel.send( "S" );
  }

  // --------------------------- REGEX ---------------------------  \\

  if( /16:20|4[\D\W]?20|w[e3]{2,}d/i.test( message.content ) ) {
    setTimeout( () => { message.react( ":blunt:766311145341845504" ) }, 1500 );
  }
  if( sameBroRE.test( message.content ) ) {
    if( ts % 2 === 0 ) message.reply( "yeah same bro" );
    else message.channel.send( message.content.replace( sameBroRE, "Yeah, $1 $2 bro" ) );
  }

  // --------------------------- USER SPECIFIC -------------------------- \\

  if( message.author.id === bot.var.members.kenny && ts % 2 === 0 ) {
    message.react( ts % 8 === 0 ? "<:kenny4:765580912305373184>" : (ts % 6 === 0 ? "<:kenny3:768879445808922624>" : (ts % 4 === 0 ? "<:kenny2:531712859290337290>" : "<:kenny:519211832720883724>")) );
  }

  if( message.author.id === bot.var.members.emmy && ts % 11 === 0 ) {
    const randEmoji = bot.emojis.cache.random();
    message.react( `<:${randEmoji.name}:${randEmoji.id}>` );
  }

  // --------------------------- TIME STAMPS -------------------------- \\

  if( ts % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    setTimeout( () => { message.react( "\u0039\u20E3" ) }, 1500 );
    const filter = ( reaction, user ) => !!reaction.emoji && user.id !== bot.user.id
    message.awaitReactions( filter, { time: 25000 } ).then( (collected) => {
      if( collected.size > 2 ) {
        message.channel.send( ts % 2 === 0 ? "SHUCKS :sweat_drops:" : "AWESOME" ); 
      }
      else if( collected.size > 0 ) {
        message.channel.send( ts % 2 === 0 ? "YALL ARE EPIC" : "THNX !" );
      }
    });
  }
  // 0x5f3759df = 99841437 in base ten, there's a slim chance a timestamp can be a multiple of this magic number
  else if( ts % 0x5f3759df === 0 ) { 
    message.pin({ reason: "important" });
    setTimeout( () => { message.react( ":pray:" ) }, 3000 );
    message.reply( "`// what the fuck?` https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );
    message.channel.send( ":pray: ***YOU ARE THE CHOSEN ONE*** :pray:" );
  }

};
