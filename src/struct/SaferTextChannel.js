import { Structures } from "discord.js";

console.debug( "Expanding Discord TextChannel" );

Structures.extend( "TextChannel", ( TextChannel ) => {

  class SaferTextChannel extends TextChannel {

    constructor( guild, data ) {
      super( guild, data );
    }

    // makes Message.reply throw an error if you use SaferMessage; mutually exclusive for now
    send = ( content ) => {
      super.send( content ).catch( console.error );
    };

  } // EO SaferMessage

  return( SaferTextChannel );

});
