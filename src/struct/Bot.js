import { Client, Collection } from "discord.js";
import { homeGuildId } from "../../secrets.json";

/**
 * A subclass of Discord.Client to include a selection of config variables.
 * Mainly just a bunch of hardcoded IDs
 * @extends Client
 * @property {Collection<string,Command>} commands - a map of {@link Command}s that the bot can execute
 */
class Bot extends Client {

  /**
   * @param {ClientOptions} ClientOptions - Discord Client ClientOptions
   */
  constructor( ClientOptions ) {

    super( ClientOptions );

    /**
     * @type {Collection<string,Command>}
     */
    this.commands = new Collection();
    this.admins = ClientOptions.admins;
    this.homeGuildId = ClientOptions.homeGuildId;

  }

  /**
   * incredible
   */
  postError = ( error ) => {
    const channel = this.guilds.resolve( homeGuildId )?.channels.cache.find( channel => /^b[o0]t/i.test( channel?.name ) );
    if( !!channel ) {
      channel.send( "damn,,,this hits hard,... `" + error.name +  "`\n```\n" + error.message + "\n```" ).catch( console.error );
    }
    else {
      console.info( "no guild channel found to post error to" );
    }
  }

};

export default Bot;

/**
 * @typedef {import('discord.js').ClientOptions} ClientOptions
 */
