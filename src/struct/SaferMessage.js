import { Structures } from "discord.js";
import { sendBulk } from "../util/commandUtil";

console.debug( "Expanding Discord.Message" );

Structures.extend( "Message", ( Message ) => {

  /**
   * Custom Discord Message subclass.
   * Overrides response methods so that we:
   * - Always catch errors 
   * - Auto bulk send large messages
   * - Auto react delay
   * - `Message.channel.send` shorthand for consistancy with `Message.reply`
   * @extends Message
   */
  class SaferMessage extends Message {

    constructor( client, data, channel ) {
      super( client, data, channel );
    }

    /**
     * react to a message after a 1 second delay
     * @override
     * @method react
     * @memberof SaferMessage
     * @param {string} emoji - a resolvable emoji; Error on unresolvable
     * @param {number} [delay=1000] - how long in ms to delay the reaction
     * @returns {void}
     * @todo
     * maybe return the promise here too idk
     */
    react = ( emoji, delay = 1000 ) => {
      setTimeout( () => {
        super.react( emoji ).catch( console.error );
      }, delay );
    }

    /**
     * send a message in the message channel's orgin, calling a bulk send on content over 2000 characters
     * @method send
     * @memberof SaferMessage
     * @param {(string|APIMessage)} content - the content to send; Can also be an APIMessage object
     * @returns {?Promise<Message>} null on a send bulk
     * @todo
     * maybe we want to bundle up all of the bulk send promises and return them from send bulk
     * no idea what I would do with that tho
     */
    send = ( content ) => {
      let response = null;
      // this can cause an infinite loop if sendBulk is bad?
      if( content?.length > 2000 ) {
        sendBulk( content, this );
      }
      else {
        response = this.channel.send( content ).catch( console.error );
      }
      return( response );
    }

    /**
     * reply to the message author
     * @override
     * @method reply
     * @memberof SaferMessage
     * @param {string} content - the content to send
     * @returns {Promise<Message>}
     */
    reply = ( content ) => {
      const response = super.reply( content ).catch( console.error );
      return( response );
    }

  } // EO SaferMessage

  return( SaferMessage );

});

/**
 * @typedef {import('discord.js').APIMessage} APIMessage
 * @typedef {import('discord.js').Message} Message
 */
