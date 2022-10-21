import Event from '../struct/Event';
import Constants from '../util/constants';
import { PermissionsBitField } from "discord.js";

/**
 * the sacred geefa
 */
class Geefa extends Event {

  constructor() {
    super({ name: "geefa", type: "datetime" });
  }

  /**
   * minutes == 20 --> it's probably 4:20am/pm somewhere in the world
   * @param {Boolean} [force=false] - force trigger to be true
   */
  canTrigger = ( force = false ) => {
    const date = new Date();
    if( date.getMinutes() === 20 || force === true ) {
      return( true );
    }
    return( false );
  }

  /**
   * blunt react all messages collected
   * maybe on rare occasions send the mf like button
   * maybe make the react hit all channels?
   * @param {Bot} bot
   */
  geefa = ( bot, context ) => {

    /** @type {TextChannel} */
    const channel = context.channel || bot.guilds.cache.get( bot.homeGuildId ).channels.cache.find( ( c ) => {
      return( c.isTextBased() && c.permissionsFor( bot.user.id ).has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.AddReactions
      ]));
    });

    if( !!channel ) {

      console.debug( "initiating geefa collector in:", channel.name );
      const emoji = channel.guild.emojis.cache.find( ( e ) => { /blunt/i.test( e.name ) } ) || "\u{1F96C}";
      const collector = channel.createMessageCollector({ time: Constants.time.ONE_MINUTE });

      collector.on( "collect", ( message ) => {
        message.react( emoji ).catch( console.error );
      });

      collector.on( "end", ( collected ) => {
        if( collected.size > 0 ) {
          channel.send( "nice" );
        }
        console.debug( "geefa collection over" );
      });

    }
    else {
      console.info( "no text channel to geefa to, sad" );
    }
  }

}

export default new Geefa();

/**
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../struct/Bot').default} Bot
 */