import { readdirSync } from "fs";
import InternalError from "../struct/InternalError.js";

/**
 * Handy functions for our Client
 * @module clientUtil
 * @todo make this a class with static methods
 * @todo create something to clean up old/unused slash commands
 * @todo make a slashcommand validation thing
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
    slashCommandFiles = readdirSync( "src/commands" ).map( elem => elem += "/options.json" );
  }
  else {
    slashCommandFiles.push( command + "/options.json" );
  }

  for( const file of slashCommandFiles ) {

    const path = `../commands/${file}`;
    if( !!require.cache[ require.resolve( path ) ] ) {
      delete require.cache[ require.resolve( path ) ];
    }

    const slashCommand = require( path );
    const commandName = slashCommand.name;

    if( !!commandName && bot.commands.has( commandName ) ) {

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
      else {
        // this means any server the bot's apart of can execute
        // note that app wide commands can take hours to appear
        bot.application.commands.create( slashCommand );
      }

    }
    else {
      throw new InternalError( `Command not found: ${commandName}` );
    }

  }

};

/**
 * @typedef {import('../struct/Bot.js')} Bot
 * @typedef {import('../struct/Command.js')} Command
 */
