import { Structures } from "discord.js";

console.debug( "Expanding Discord.Message" );

// -- Overriding the base response methods so that we always catch errors & delay a reaction
//    the goal is to make it harder for me to be an idiot
Structures.extend( "Message", Message => {

  class SaferMessage extends Message {

    constructor( client, data, channel ) {

      super( client, data, channel );
      //this.channel = channel;

      this.react = ( EmojiResolvable, delay ) => {
        delay = parseInt( delay ) || 1000;
        setTimeout( () => {
          super.react( EmojiResolvable ).catch( console.error );
        }, delay );
      };

      // Adding send to base message for convienence
      this.send = ( StringResolvable ) => {
        channel.send( StringResolvable ).catch( console.error );
      };

      this.reply = ( StringResolvable ) => {
        super.reply( StringResolvable ).catch( console.error );
      };

      // maybe also add a delaySend/reply, idk

    }

  } // EO SaferMessage

  return( SaferMessage );

});
