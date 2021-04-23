import { execSync } from "child_process";
import events from "../events.json";
import config from "../config.json";

/** 
 * @method loadCommands
 * @description imports all or one command module into the bot. Overwrites the require cache if the command was already imported
 * * @param { Discord.Client } bot client to load to
 * * @param { string } singularCommand optional: the name of one command to load
 * * @returns { void }
 * **/
export const loadCommands = ( bot, singularCommand ) => {
  if( !!singularCommand ) {
    if( !!require.cache[ require.resolve( `./commands/${singularCommand}` ) ] ) {
      delete require.cache[ require.resolve( `./commands/${singularCommand}` ) ];
    }
    const command = require( `./commands/${singularCommand}` );
    bot.commands.set( command.default.name, command.default );
  }
  else {
    // EVER HEARD OF FS.READDIRSYNC ?????????????????????????????/
    // On Wednesdays We Kode
    const commandFiles = [
      ...execSync( "ls lib/commands/ | grep \.js" ).toString().split( /\s/ ),
      ...execSync( "ls lib/commands/.ccs/ | grep \.js | sed -E \"s/^(.+)/.ccs\\/\\1/\"" ).toString().split( /\s/ ) 
    ]
    for( const file of commandFiles ) {
      //console.info( "=> ", file );
      if( !!file ) {
        if( !!require.cache[ require.resolve( `./commands/${file}` ) ] ) {
          delete require.cache[ require.resolve( `./commands/${file}` ) ];
        }
        const command = require( `./commands/${file}` );
        bot.commands.set( command.default.name, command.default );
      }
    }
    console.info( "Loading events & config into bot variable ..." );
    bot.var.events = events;
    bot.var.config = config;
    console.info( "done wow" );

    /*
    //if( !!require.cache[ require.resolve( "../events.json" ) ] ) {
      //delete require.cache[ require.resolve( "../events.json" ) ];
    //}
    for( let event in events ) {
      events[event].date = new Date( events[event].date );
      //console.info( "=>", events[event].name );
      //console.info( events[event] );
      bot.var.events.set( events[event].name, events[event] );
    }
    */
  }
};

/** 
 * @method validateGuild
 * @description validates guild.json to prevent the client from breaking from my expertly hard coded guild variables
 * * @param { Discord.Client } bot client to validate guild.json on
 * * @returns { void }
 * **/
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
      console.warn( `Channel: ${bot.var.channels[key]} doesn't exist; Falling back to a random channel` );
      bot.var.channels[key] = bot.channels.cache.random().id;
    }
    // we can set the channels here too, but it's dependent on channel properties that can change
    //const chan = bot.channels.cache.find( elem => elem.name === key+"" );
    //if( !!chan ) bot.var.channels[key] = chan.id;
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
        console.warn( `Role: ${bot.var.roles[key]} doesn't exist; Falling back to a random role` );
        r = guild.roles.cache.random().id;
      }
      else {
        r = bot.var.roles[key];
      }
      bot.var.roles[key] = `<@&${r}>`;
    }
  }

  // -- Search for user id dependencies
  if( !bot.var.members["kenny"] ) {
    bot.var.members.kenny = "no kenny"
  }

  console.info( "Guild validation complete" );

};