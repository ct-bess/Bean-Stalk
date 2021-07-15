/**
 * Text processing functions
 * @module textUtil
 */

/**
 * converts a number to its' emoji representation if possible; N.B. This is not an EmojiResolvable that you can react with
 * @function numberToEmoji
 * @param {number} number - the number to convert, base whatever
 * @returns {string} the emoji representation as a string, but it's base 10
 */
export const numberToEmoji = ( number ) => {

  let int  = parseInt( number );
  if( !int ) {
    console.warn( "cannot convert this alledged number to an emoji:", number );
    return( number );
  }

  let conversion = "";
  const lut = [
    ":zero:",
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:"
  ];

  // Certified JS Moment: array["1"] === array[1] b/c arrays are really just objects with indicies as keys
  int += "";
  for( let i = 0; i < int.length; ++i ) {
    conversion += lut[int[i]];
  }

  return( conversion );

};
