import { Client, Collection } from "discord.js";
import { homeGuildId } from "../../secrets.json";
import Constants from "../util/constants";

/**
 * A subclass of Discord.Client to include a selection of config variables.
 * Mainly just a bunch of hardcoded IDs
 * @extends Client
 * @property {Collection<string,Command>} commands - a map of {@link Command}s that the bot can execute
 */
class Bot extends Client {

  /**
   * time events
   */
  eventInterval = setInterval( () => {

    const memUsageMB = process.resourceUsage().maxRSS / 1000;
    if( memUsageMB > 150 ) {
      console.warn( "Our little node process is using a huge amount of memory:", memUsageMB, "MB" );
    }

    /** @type {Collection<string,Event>} */
    const events = this.events.datetime;
    events.forEach( ( event, name ) => {
      event.exec( this );
    });

  }, Constants.time.ONE_MINUTE );

  /**
   * @param {ClientOptions} ClientOptions - Discord Client ClientOptions plus some other greatness
   */
  constructor( ClientOptions ) {

    super( ClientOptions );

    /** @type {Collection<string,Command>} */
    this.commands = new Collection();

    /** @type {{Collection<string,Event>}} */
    this.events = {
      datetime: new Collection()
    };

    /** @type {Array<string>} */
    this.admins = ClientOptions.admins;

    /** @type {string} */
    this.homeGuildId = ClientOptions.homeGuildId || homeGuildId;

    this.eventInterval.unref();

  }

  /**
   * incredible
   * @param {Error} error
   */
  postError = ( error ) => {
    const guild = this.guilds.resolve( homeGuildId );
    const channel = guild?.channels.cache.find( channel => /^b[o0]t/i.test( channel?.name ) );
    if( !!guild && !!channel ) {
      channel.send( "damn,,,this hits hard,... `" + error.name + "`\n```\n" + error.message + "\n```" ).catch( console.error );
      if( Math.floor( Math.random() * 50 ) === 25 ) {
        guild.members.cache.random().createDM().then( dmChannel => { dmChannel.send( "hey scuse me,,," ) } ).catch( console.error );
      }
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
