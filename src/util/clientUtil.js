import { readdirSync } from "fs";

/**
 * Handy functions for our Client
 * @module clientUtil
 * @todo create something to clean up old/unused slash commands
 */

/**
 * Registers command(s) to the client as slash commands.
 * Note that it may take over an hour for the update to occur when posting to the client rather than a specific guild
 * @param {string} [command] - the specific command to post
 * @param {Bot} bot - the discord client
 * @returns {void}
 */
export const postSlashCommands = ( bot, command ) => {

  let slashCommandFiles = [];

  if( !command ) {
    slashCommandFiles = readdirSync( "slashCommands" ).filter( file => file.endsWith( ".json" ) );
  }
  else {
    // check that this exists
    slashCommandFiles.push( command + ".json" );
  }

  for( const fileName of slashCommandFiles ) {

    const path = `../../slashCommands/${fileName}`;
    if( !!require.cache[ require.resolve( path ) ] ) {
      delete require.cache[ require.resolve( path ) ];
    }

    const slashCommand = require( path );
    const commandName = fileName.substring( 0, fileName.length - 5 );

    if( bot.commands.has( commandName ) ) {

      // string or array of guild ids
      const guildId = bot.commands.get( commandName ).guild;
      if( !!guildId ) {

        if( guildId instanceof Array ) {
          for( const g of guildId ) {
            const guild = bot.guilds.resolve( g );
            guild.commands.create( slashCommand );
          }
        }
        else if( typeof( guildId ) === "string" ) {
          const guild = bot.guilds.resolve( guildId );
          guild.commands.create( slashCommand );
        }

      }
    }
    // this means any server the bot's apart of can execute
    // note that app wide commands can take hours to appear
    else {
      bot.application.commands.create( slashCommand );
    }

  }

};

/**
 * @typedef {import('../struct/Bot.js')} Bot
 * @typedef {import('../struct/Command.js')} Command
 */
