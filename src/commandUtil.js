import { Collection } from "discord.js";

/**
 * version 3: Name Pending
 * uses a custom split function for partial splits that keep the entire input
 * e.g.
 * 'My Awesome String'.split( /\s+/, 2 ) = [ 'My', 'Awesome String' ] rather than just [ 'My', 'Awesome' ]
 * That'll make this code much cleaner because when we hit a user's string variable, we can just split the right half by the double quote
 * To capture it, and the split by the spaces will preserve the right half too
 * Then we also wont have to join at the end for the expression
 **/

/**
 * @method argHandler
 * @description returns a command input into arguments mapped to a subcommand, flags/variables, and an expression
 * * @param { Discord.Message } message the message that executed the command
 * * @returns { Discord.Collection } the mapped results: subcommand get(0), expression get(1), flags/variables get("x")
 **/
export const argHandler = ( message ) => {

  // expected format and orders:
  // command subcommand [ flags/variables ] [ expression ]
  // command [ flags/variables ] subcommand [ expression ]
  // argMap usage:
  // get( 0 ) = subcommand
  // get( 1 ) = expression
  // get( "x" ) = flag/variable

  let args = message.content.split( /\s+/ );
  // Is it overkill to use a deescord map here?
  const argMap = new Collection();
  let subcommandSet = false, expressionSet = false;

  // command name is always first no exceptions
  const command = args.shift().toLowerCase();
  // this was an after thought, one day i'll make it 0, 1, 2 for cmd, sub cmd, expr
  argMap.set( -1, command );

  console.info( "Parsing arguments for", command );

  // Version 2: Fungal Smelter
  while( args.length > 0 && !expressionSet ) {
    const arg = args[0];
    let argVal = -2, argName = -1;
    console.debug( "args:", args );

    if( arg.startsWith( '--' ) ) {
      const fullArg = arg.split( "=", 2 );
      argName = ( fullArg[0] + "" ).substring( 2 ) || -1;
      argVal = fullArg[1] || -2;
      console.debug( "processing verbose arg:", fullArg );
      if( fullArg.length === 2 ) {
        if( argVal.startsWith( '"' ) && !argVal.endsWith( '"' ) ) {
          args.shift();
          argVal = argVal.substring( 1 );
          do {
            argVal += " " + args.shift();
            console.debug( "concated argVal:", argVal );
          } while( !argVal.endsWith( '"' ) && args.length > 0 );
          argVal = argVal.substring( 0, argVal.length-1 );
        }
        else {
          args.shift();
        }
      }
    }
    else if( arg.startsWith( '-' ) ) {
      argName = arg.substring( 1 );
      console.debug( "processing boolean arg:", argName );
      argVal = true;
      args.shift();
    }
    else if( subcommandSet ) {
      argName = 1;
      argVal = args.join(" ") || -2;
      expressionSet = true;
    }
    else {
      argName = 0;
      argVal = arg;
      subcommandSet = true;
      args.shift();
    }

    console.debug( "Setting:", argName, argVal );
    argMap.set( argName, argVal );
  }

  /* // Version 1: Space Hater
  for( const arg of args ) {
    if( arg.startsWith( '--' ) ) {
      const argName = arg.split( "=", 1 )[0];
      argMap.set( argName.substring( 2, argName.length ), arg.substring( argName.length+1 ) );
    }
    else if( arg.startsWith( '-' ) ) {
      argMap.set( arg.substring( 1 ), true );
    }
    else if( !subcommandSet ){
      argMap.set( 0, arg ); // subcommand
      subcommandSet = true;
    }
    else {
      argMap.set( 1, arg ); // expression
    }
  }
  */

  console.debug( argMap );

  return( argMap );

};

/** 
 * @method coalesce
 * @description converts a name or snowflake ID to its' corresponding discord class
 * * @param { string } name the user, channel, or role name we are coalescing
 * * @param { string } type what discord class type we are converting it to (member, channel, or role)
 * * @param { Discord.Client } bot discord client processing this (not needed for member and role coalescing)
 * * @param { Discord.Guild } guild guild origin (not needed for channel coalescing)
 * * @returns { * } the discord class with respect to the input type; If null the coalescing failed
 * **/
export const coalesce = ( name, type, bot, guild ) => {

  const isID = /\d{18}/.test( name );
  // if we get an ID, we simply try to resolve it
  type = ( type + "" ).toLowerCase() + (isID + 0);

  let base = null;

  switch( type ) {
    case "channel1":
      base = bot.channels.resolve( name );
      break;
    case "channel0":
      base = bot.channels.cache.find( channel => channel.name === name );
      break;
    case "member1":
      base = guild.members.resolve( name );
      break;
    case "member0":
      base = guild.members.cache.find( member => member.user.username === name || member.nickname === name );
      break;
    case "role1":
      base = guild.roles.resolve( name );
      break;
    case "role0":
      base = guild.roles.cache.find( role => role.name === name );
      break;
    default:
      console.warn( "coalesce called on invalid type:", type );
  }

  return( base );

};

/** 
 * @method sendBulk
 * @description partitions a large message into 2000 character pieces and sends each part every 1.5 seconds
 * * @param { Discord.Message } message the message origin
 * * @returns { void }
 * **/
export const sendBulk = ( response, message, format ) => {
  console.info( "[ INFO ] sendBulk() response length: " + response.length );
  let textBound = 2000, delay = 1500;
  let prefix = "", suffix = "";
  switch( format ) {
    case "italics":
      textBound = 1998;
      prefix = "*", suffix = prefix;
      break;
    case "bold":
      textBound = 1996;
      prefix = "**", suffix = prefix;
      break;
    case "inline code":
      textBound = 1998;
      prefix = "`", suffix = prefix;
      break;
    case "quote":
      textBound = 1998;
      prefix = "> ";
      break;
    case "quote block":
      textBound = 1996;
      prefix = ">>> ";
      break;
    case "code block":
      textBound = 1992;
      prefix = "```\n", suffix = "\n```";
      break;
    default:
      textBound = 2000;
      prefix = "", suffix = "";
  }
  if( response.length < textBound ) {
    console.warn( "[ WARN ] sendBulk called on string < 2000" );
  }
  for( let i = 0; i < response.length; i += textBound ) {
    const chunk = response.substring( i, i + textBound );
    delay += 1500;
    //message.channel.send( prefix + chunk + suffix );
    setTimeout( () => { message.channel.send( prefix + chunk + suffix ) }, delay );
  }
};
