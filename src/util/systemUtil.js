import { execSync } from "child_process";
import events from "../../events.json";
import config from "../../config.json";
/**
 * Various admin functions for the client to call
 * @module systemUtil
 */

/** 
 * imports all or one command module into the bot. Overwrites the require cache if the command was already imported
 * @function loadCommands
 * @param {Bot} bot - client to load to
 * @param {boolean} [override] - wether to override existing commands or not. If true, rejects setting a command if the bot already has a command with that name or alias
 * @param {string} [commandName] - the name of one command to load. Defaults to all commands
 * @returns {void}
 * @todo 
 * edit the command requires to new Command() when we change the Commands' default export
 */
export const loadCommands = ( bot, override, commandName ) => {

  console.debug( "loading commands with override:", override );

  const checkAndSet = ( name ) => {

    const path = `../commands/${name}`;

    if( !!require.cache[ require.resolve( path ) ] ) {
      delete require.cache[ require.resolve( path ) ];
    }

    const command = require( path );
    let validCommand = !!override;

    if( !validCommand ) {
      validCommand = !bot.commands.has( command.default.name );
      for( const alias of command.default.aliases ) {
        if( !validCommand ) break;
        validCommand = bot.commands.every( cmd => !cmd.aliases.includes( alias ) )
      }
    }

    if( validCommand ) {
      console.debug( "Setting command:", command.default.name );
      bot.commands.set( command.default.name, command.default );
    }
    else {
      console.error( "Cannot set command; Already has command name or alias included in:", command.default.name );
      delete require.cache[ require.resolve( path ) ];
    }

  }

  if( !!commandName ) {
    checkAndSet( commandName );
  }
  else {
    // EVER HEARD OF FS.READDIRSYNC ?????????????????????????????/
    // On Wednesdays We Kode
    const commandFiles = [
      ...execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ ),
      ...execSync( "ls lib/commands/.ccs/ | grep \.js | sed -E \"s/^(.+)/.ccs\\/\\1/\"" ).toString().split( /\s/ ) 
    ]
    for( const file of commandFiles ) {
      if( !!file ) {
        checkAndSet( file );
      }
    }
    console.info( "Loading events & config into bot variable ..." );
    bot.var.events = events;
    bot.var.config = config;
    console.info( "done wow" );

  }

};

/** 
 * validates guild.json to prevent the client from breaking from my expertly hard coded guild variables.
 * It's also nice to know if we've assigned an invalid admin ID ya know
 * @function validateGuild
 * @param {Bot} bot - client to validate guild.json on
 * @returns {void}
 */
export const validateGuild = ( bot ) => {

  console.info( "Validating Guild bot variables ..." );
  const guild = bot.guilds.resolve( bot.var.guild );
  if( !guild ) {
    console.warn( `Bean is in no such guild: ${bot.var.guild}` );
  }

  // -- cache specific variables

  for( const key in bot.var.channels ) {
    const chan = bot.channels.cache.has( bot.var.channels[key] );
    if( !chan ) {
      const fuzzyNameRE = new RegExp( `${key}`, "i" );
      const candidate = bot.channels.cache.find( channel => fuzzyNameRE.test( channel?.name ) );
      if( !!candidate ) {
        console.warn( `Channel: ${bot.var.channels[key]} doesn't exist; Using close match: ${candidate?.name} ${candidate.id}` );
        bot.var.channels[key] = candidate.id;
      }
      else {
        console.warn( `Channel: ${bot.var.channels[key]} doesn't exist; Falling back to a random channel` );
        bot.var.channels[key] = bot.channels.cache.random().id;
      }
    }
  }

  for( const key in bot.var.emojis ) {
    const emoji = bot.emojis.cache.has( bot.var.emojis[key] );
    let e = { name: "huge-error", id: "if-this-shows-up" };
    if( !emoji ) {
      const fuzzyNameRE = new RegExp( `${key}`, "i" );
      const candidate = bot.emojis.cache.find( emoji => fuzzyNameRE.test( emoji.name ) );
      if( !!candidate ) {
        console.warn( `Emoji: ${bot.var.emojis[key]} is invalid; Using a close match :${candidate.name}:${candidate.id}` );
        e = candidate;
      }
      else {
        console.warn( `Emoji: ${bot.var.emojis[key]} doesn't exist; Falling back to a random emoji` );
        e = bot.emojis.cache.random();
      }
    }
    else {
      e = bot.emojis.cache.get( bot.var.emojis[key] );
    }
    bot.var.emojis[key] = `<:${e.name}:${e.id}>`;
  }

  // -- Guild specific variables

  if( !!guild ) {

    for( const key in bot.var.roles ) {
      const role = guild.roles.cache.has( bot.var.roles[key] );
      let r = "Another-Huge-Error-If-You-See-This";
      if( !role ) {
        const fuzzyNameRE = new RegExp( `${key}`, "i" );
        const candidate = guild.roles.cache.find( role => fuzzyNameRE.test( role?.name ) );
        if( !!candidate ) {
          console.warn( `Role: ${bot.var.roles[key]} doesn't exist; Using close match: ${candidate?.name} ${candidate.id}` );
          r = candidate.id;
        }
        else {
          console.warn( `Role: ${bot.var.roles[key]} doesn't exist; Falling back to a random role` );
          r = guild.roles.cache.random().id;
        }
      }
      else {
        r = bot.var.roles[key];
      }
      bot.var.roles[key] = `<@&${r}>`;
    }

  }

  console.info( "Guild validation complete" );

};

/**
 * @typedef {import('../struct/Bot').default} Bot
 */
