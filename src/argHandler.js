import { Collection } from "discord.js";

/**
 * version 3: Name Pending
 * uses a custom split function for partial splits that keep the entire input
 * e.g.
 * 'My Awesome String'.split( /\s+/, 2 ) = [ 'My', 'Awesome String' ] rather than just [ 'My', 'Awesome' ]
 * That'll make this code much cleaner because when we hit a user's string variable, we can just split the right half by the double quote
 * To capture it, and the split by the spaces will preserve the right half too
 * Then we also wont have to join at the end for the expression
 **/

/**
 * @param { Discord.Message } message
 * @param { integer } splits
 * @returns { Discord.Collection }
 **/
export const argHandler = ( message ) => {

  // expected format and orders:
  // command subcommand [ flags/variables ] [ expression ]
  // command [ flags/variables ] subcommand [ expression ]
  // argMap usage:
  // get( 0 ) = subcommand
  // get( 1 ) = expression
  // get( "x" ) = flag/variable

  let args = message.content.split( /\s+/ );
  // Is it overkill to use a deescord map here?
  const argMap = new Collection();
  let subcommandSet = false, expressionSet = false;

  // command name is always first no exceptions
  const command = args.shift();
  console.info( "Parsing arguments for", command );

  // Version 2: Fungal Smelter
  while( args.length > 0 && !expressionSet ) {
    const arg = args[0];
    let argVal = -2, argName = -1;
    console.debug( "args:", args );

    if( arg.startsWith( '--' ) ) {
      const fullArg = arg.split( "=", 2 );
      argName = fullArg[0].substring( 2 ) || -1;
      argVal = fullArg[1] || -2;
      console.debug( "processing verbose arg:", fullArg );
      if( argVal.startsWith( '"' ) ) {
        args.shift();
        argVal = argVal.substring( 1 );
        do {
          argVal += " " + args.shift();
          console.debug( "concated argVal:", argVal );
        } while( !argVal.endsWith( '"' ) && args.length > 1 );
        argVal = argVal.substring( 0, argVal.length-1 );
      }
      else {
        args.shift();
      }
    }
    else if( arg.startsWith( '-' ) ) {
      argName = arg.substring( 1 );
      console.debug( "processing boolean arg:", argName );
      argVal = true;
      args.shift();
    }
    else if( subcommandSet ) {
      argName = 1;
      argVal = args.join(" ") || -2;
      expressionSet = true;
    }
    else {
      argName = 0;
      argVal = arg;
      subcommandSet = true;
      args.shift();
    }

    console.debug( "Setting:", argName, argVal );
    argMap.set( argName, argVal );
  }

  /* // Version 1: Space Hater
  for( const arg of args ) {
    if( arg.startsWith( '--' ) ) {
      const argName = arg.split( "=", 1 )[0];
      argMap.set( argName.substring( 2, argName.length ), arg.substring( argName.length+1 ) );
    }
    else if( arg.startsWith( '-' ) ) {
      argMap.set( arg.substring( 1 ), true );
    }
    else if( !subcommandSet ){
      argMap.set( 0, arg ); // subcommand
      subcommandSet = true;
    }
    else {
      argMap.set( 1, arg ); // expression
    }
  }
  */

  console.debug( argMap );

  return( argMap );

};
