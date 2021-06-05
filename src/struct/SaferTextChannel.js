import { Structures } from "discord.js";

console.debug( "Expanding Discord TextChannel" );

Structures.extend( "TextChannel", ( TextChannel ) => {

  class SaferTextChannel extends TextChannel {

    constructor( guild, data ) {
      super( guild, data );
    }

    send = ( content ) => {
      super.send( content ).catch( console.error );
    };

  } // EO SaferMessage

  return( SaferTextChannel );

});
