import { Collection } from "discord.js";
/** 
 * A collection of utility functions for the {@link Command} class
 * @module commandUtil 
 */

/**
 * returns a command input into arguments mapped to a subcommand, flags/variables, and an expression.
 * Contents are split by any number of spaces, but verbose variables and the expression retain all of their spaces
 * @function argHandler
 * @param {(Message|string)} message - the Discord.Message that executed the command; Or the message content string
 * @returns {Collection<commandArg,argVal>} the mapped results: subcommand get(0), expression get(1), flags/variables get("x")
 * @example
 * const args = argHandler( 'commandName -flag --variable="awesome spaces" -anotherFlag --anotherVar=awesome subcommand now expression time' );
 * console.log( args.get( -1 ) );               // expected output: "commandName"
 * console.log( args.get( 0 ) );                // expected output: "subcommand"
 * console.log( args.get( "flag" ) );           // expected output: true
 * console.log( args.get( "variable" ) );       // expected output: "awesome spaces"
 * console.log( args.has( "anotherFlag" ) );    // expected output: true
 * console.log( args.has( "doesntHaveThis" ) ); // expected output: false
 * console.log( args.get( "anotherVar" ) );     // expected output: "awesome"
 * console.log( args.get( 1 ) );                // expected output: "now expression time"
 * @todo
 * **version 3: Name Pending**
 * uses a custom split function for partial splits that keep the entire input
 * e.g.
 * 
 * ```js
 * 'My Awesome String'.split( /\s+/, 2 ) = [ 'My', 'Awesome String' ] rather than just [ 'My', 'Awesome' ]
 * ```
 * 
 * That'll make this code much cleaner because when we hit a user's string variable, we can just split the right half by the double quote
 * To capture it, and the split by the spaces will preserve the right half too
 * Then we also wont have to join at the end for the expression
 */
export const argHandler = ( message ) => {

  let args = [];

  if( !!message.content ) {
    args = message.content.split( /\s+/ );
  }
  else {
    args = (message + "").split( /\s+/ );
  }

  const argMap = new Collection();
  let subcommandSet = false, expressionSet = false;

  // command name is always first no exceptions
  const command = args.shift().toLowerCase();
  // this was an after thought, one day i'll make it 0, 1, 2 for cmd, sub cmd, expr
  argMap.set( -1, command );

  console.debug( "Parsing arguments for:", command );

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
 * converts a name or snowflake ID to its' corresponding discord class
 * @function coalesce
 * @param {string} name - the user, channel, or role name or snowflake ID we are coalescing
 * @param {("channel"|"member"|"role")} type - what discord class type we are converting it
 * @param {Bot} [bot] - discord client processing this (not needed for member and role coalescing)
 * @param {Guild} [guild] - guild origin (not needed for channel coalescing)
 * @returns {?(Channel|Member|Role)} the Discord object with respect to the input type; If null the coalescing failed
 * @example
 * // convert text channel name to its' corresponding Discord.TextChannel object:
 * const channel = coalesce( "general", "channel", bot );
 * @example
 * // convert a member's ID to the member object from some guild:
 * const member = coalesce( "111111111111111111", "member", null, bot.guilds.cache.first() );
 */
export const coalesce = ( name, type, bot, guild ) => {

  const isID = /\d{18}/.test( name );
  // if we get an ID, we simply try to resolve it
  type = ( type + "" ).toLowerCase() + (isID + 0);

  console.debug( "coalescing:", name, "to", type, "isID:", isID );

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
 * partitions a large message into 2000 character pieces and sends each part in 1.5 second intervals
 * @function sendBulk
 * @param {string} response - long string we want to send in bulk
 * @param {Message} message - message origin
 * @param {("italics"|"bold"|"inline code"|"quote"|"quote block"|"code block")} [format] - markdown text format to apply to entire response
 * @param {string} [codeBlockType=""] - the language to format the code with
 * @returns {void}
 * @example
 * // send a javascript code block:
 * sendBulk( "// some js code ...", message, "code block", "js" );
 * @todo 
 * add strike through text format option
 * @todo 
 * add spoiler text format option
 */
export const sendBulk = ( response, message, format, codeBlockType = "" ) => {

  console.debug( "sendBulk called for response length: " + response?.length );
  let textBound = 2000, delay = 1500;
  let prefix = "", suffix = "";

  switch( format ) {
    case "italics":
      prefix = "*", suffix = prefix;
      break;
    case "bold":
      prefix = "**", suffix = prefix;
      break;
    case "inline code":
      prefix = "`", suffix = prefix;
      break;
    case "quote":
      prefix = "> ";
      break;
    case "quote block":
      prefix = ">>> ";
      break;
    case "code block":
      prefix = "```" + codeBlockType + "\n", suffix = "\n```";
      break;
    default:
      textBound = 2000;
  }

  textBound = textBound - prefix.length - suffix.length;

  if( response.length < textBound ) {
    console.warn( "sendBulk called on string < 2000" );
  }

  for( let i = 0; i < response.length; i += textBound ) {
    const chunk = response.substring( i, i + textBound );
    delay += 1500;
    setTimeout( () => { 
      message.send( prefix + chunk + suffix ) 
    }, delay );
  }

};

/** 
 * The keys of an argument map created by [argHandler]{@link module:commandUtil~argHandler}
 * - `-1` = command name
 * - `0` = sub command name
 * - `1` = command's expression
 * - `string` = any other arguments supplied
 * @typedef {(number|string)} commandArg
 */

/** 
 * The values of an argument map created by [argHandler]{@link module:commandUtil~argHandler}
 * @typedef {(boolean|string)} argVal
 */

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Guild} Guild
 * @typedef {import('discord.js').Member} Member
 * @typedef {import('discord.js').Role} Role
 * @typedef {import('discord.js').Channel} Channel
 * @typedef {import('../struct/Bot').default} Bot
 */
