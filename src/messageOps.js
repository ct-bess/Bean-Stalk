import { createDigraphs, generateSentence } from "./digraphUtil.js";

const sameBroRE = /i(?:'?m)?\s.*(love|just|for|really|look)\s(\w+)/i;
const amogusRE = /amon?g.?us|sus|red|task|meet|vent|scan|trash|button|vote|imposter|O2|electrical/i;

/** 
 * @method messageOps
 * @description runs a message through a gauntlet of horrible inside jokes and makes the client respond accordingly
 * * @param { Discord.Message } message the message origin
 * * @param { Discord.Client } bot client processing the message
 * * @returns { void }
 * **/
export const messageOps = ( message, bot ) => {

  const ts = message.createdTimestamp;
  const d100 = Math.floor( Math.random() * 101 );

  const last3m = message.channel.messages.cache.last( 4 );
  const last3mMatch = last3m[0]?.content === last3m[1]?.content;

  // --------------------------- YUP ---------------------------  \\

  if( last3mMatch && (last3m[0]?.content === last3m[2]?.content) && message.content.length > 0 ) {
    message.send( message.content );
  }
  else if( message.content === "S" ) {
    message.send( "S" );
  }
  else if( ( message.content === "ok" || message.content.length > 1420 ) && ts % 2 === 0 ) {
    message.send( "ok" );
  }

  // --------------------------- REGEX ---------------------------  \\

  if( /16:20|4[\D\W]?20|w[e3]{2,}d/i.test( message.content ) ) {
    message.react( bot.var.emojis.blunt );
  }
  if( sameBroRE.test( message.content ) ) {
    if( ts % 7 === 0 && d100 > 50 ) message.reply( `yeah same bro ${bot.var.emojis.goodpoint}` );
    else if( ts % 11 === 0 && d100 > 75 ) message.send( message.content.replace( sameBroRE, "Yeah, $1 $2 bro" ) );
    else message.react( bot.var.emojis.goodpoint );
  }
  if( amogusRE.test( message.content ) ) {
    if( ts % 7 === 0 && d100 > 50 ) message.send( `${bot.var.emojis.sus} That's sus ${bot.var.emojis.sus}` );
    else if( ts % 11 === 0 && d100 > 75 ) message.reply( "You are SUS" );
    else message.react( bot.var.emojis.sus );
  }

  // --------------------------- USER SPECIFIC -------------------------- \\

  if( message.author.id === bot.var.members.kenny && ts % 2 === 0 ) {
    message.react( ts % 8 === 0 ? "<:kenny4:765580912305373184>" : (ts % 6 === 0 ? "<:kenny3:768879445808922624>" : (ts % 4 === 0 ? "<:kenny2:531712859290337290>" : "<:kenny:519211832720883724>")) );
  }

  if( message.author.id === bot.var.members.emmy && ts % 11 === 0 && d100 > 30 ) {
    const randEmoji = bot.emojis.cache.random();
    message.react( `<:${randEmoji.name}:${randEmoji.id}>` );
  }

  // --------------------------- TIME STAMPS & DICE -------------------------- \\

  if( d100 < 4 && ts % 2 === 0 ) {
    const filter = message => !!message.content;
    const channel = message.channel;
    const messages = [ message.content ];

    channel.awaitMessages( filter, { time: 60*1000 } ).then( collected => {

      collected.forEach( message => {
        messages.push( message.content );
      });
      const size = Math.floor( Math.random() * 6 ) + 2;
      const digraphs = createDigraphs( messages );
      const sentence = generateSentence( digraphs, size ) || "";
      if( sentence.length > 0 && sentence.length < 2000 ) channel.send( sentence );
      else console.error( "sentence was empty or too beeg" );

    });
  }

  if( d100 > 98 && ts % 2 === 0 ) {
    const iterations = Math.floor( Math.random() * 21 );
    let response = "";
    for( let i = 0; i < iterations; ++i ) {
      const char = String.fromCodePoint( 8 + Math.floor( Math.random() * 169993 ) );
      response += char + " ";
    }
    console.info( "Wacky unicode messageOp incoming:", response );
    message.send( response );
  }

  if( ts % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    message.react( "\u0039\u20E3", 2000 );
    const filter = ( reaction, user ) => !!reaction.emoji && user.id !== bot.user.id
    message.awaitReactions( filter, { time: 25000 } ).then( (collected) => {
      if( collected.size > 2 ) {
        message.send( ts % 2 === 0 ? "SHUCKS :sweat_drops:" : "AWESOME" ); 
      }
      else if( collected.size > 0 ) {
        message.send( ts % 2 === 0 ? "YALL ARE EPIC" : "THNX !" );
      }
    });
  }
  // 0x5f3759df = 99841437 in base ten, there's a slim chance a timestamp can be a multiple of this magic number
  else if( ts % 0x5f3759df === 0 ) { 
    message.react( ":pray:" );
    message.reply( "`// what the fuck?` https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );
    message.send( ":pray: ***YOU ARE THE CHOSEN ONE*** :pray:" );
    message.pin({ reason: "important" });
  }

};
