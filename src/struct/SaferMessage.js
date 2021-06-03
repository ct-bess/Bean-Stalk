import { Structures } from "discord.js";

console.debug( "Expanding Discord.Message" );

Structures.extend( "Message", ( Message ) => {

  /**
   * @class SaferMessage
   * @description overrides response methods so that we always catch errors
   * @extends { Discord.Message }
   * @constructor client, data, channel
   * @override react
   * @override reply
   * @method send literally just channel.send with catch
   * **/
  class SaferMessage extends Message {

    constructor( client, data, channel ) {

      super( client, data, channel );

      this.react = ( emoji, delay ) => {
        delay = parseInt( delay ) || 1000;
        setTimeout( () => {
          super.react( emoji ).catch( console.error );
        }, delay );
      };

      // Adding send to base message for convienence
      this.send = ( content ) => {
        channel.send( content ).catch( console.error );
      };

      this.reply = ( content ) => {
        super.reply( content ).catch( console.error );
      };

      // maybe also add a delaySend/reply, idk

    }

  } // EO SaferMessage

  return( SaferMessage );

});
