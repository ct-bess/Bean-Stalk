import { Structures } from "discord.js";

console.debug( "Expanding Discord TextChannel" );

// importing this into the bot messes up message.reply() for some reason
// maybe i'm just big dumb
Structures.extend( "TextChannel", ( TextChannel ) => {

  class SaferTextChannel extends TextChannel {

    constructor( guild, data ) {

      super( guild, data );

      this.send = ( content ) => {
        super.send( content ).catch( console.error );
      };

    }

  } // EO SaferMessage

  return( SaferTextChannel );

});
