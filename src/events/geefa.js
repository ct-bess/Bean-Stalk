import Event from '../struct/Event';
import Constants from '../util/constants';

/**
 * the sacred geefa
 */
class Geefa extends Event {

  constructor() {
    super({ name: "geefa", type: "datetime" });
    this.collector = null;
  }

  /**
   * based on the host location
   * @param {Date} [date] - date to use to determine if we should geefa; defaults to now
   */
  canTrigger = ( date = new Date() ) => {
    const time = "" + date.getHours() + date.getMinutes();
    if( time === "420" || time === "1620" ) {
      return( true );
    }
    return( false );
  }

  /**
   * blunt react all messages collected
   * maybe on rare occasions send the mf like button
   * @param {Bot} bot
   */
  geefa = ( bot ) => {

    /** @type {TextChannel} */
    const channel = bot.guilds.cache.get( bot.homeGuildId ).channels.cache.find( ( c ) => { return c.isText() } );

    if( !!channel ) {

      console.debug( "initiating geefa collector" );
      const filter = () => {};
      this.collector = channel.createMessageCollector({ filter, time: Constants.time.ONE_MINUTE });
      const emoji = channel.guild.emojis.cache.find( ( e ) => { /blunt/i.test( e.name ) } ) || channel.guild.emojis.cache.random();

      this.collector.on( "collect", ( message ) => {
        if( !!emoji ) {
          message.react( emoji );
        }
      });

      this.collector.on( "end", ( collected ) => {
        if( collected.size > 0 ) {
          channel.send( "nice" );
        }
      });

    }
    else {
      console.info( "no text channel found to geefa to, sad" );
    }

  }

}

export default new Geefa();

/**
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../struct/Bot').default} Bot
 */