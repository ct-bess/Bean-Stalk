import { execSync } from "child_process";

export const createDigraphs = ( messages ) => {
  console.debug( "creating digraphs ..." );
  const digraphs = [];
  for( const message of messages ) {

    for( let i = 0; i < message.length - 1; ++i ) {
      const digraph = message[i] + message[i+1]
      if( /[a-z]{2}/i.test( digraph ) ) {
        digraphs.push( digraph );
      }
    }

  }
  console.debug( "created digraph array of size:", digraphs.length );
  return( digraphs );
};

/** 
 * @method generateSentence
 * @description given a frequency analysis and a grammar, generates a silly sentence
 * * @param { array<string> } digraphs an array of digraphs
 * * @param { integer } size how many words to make the sentence
 * * @param { string } grammar the grammar to follow
 * * @returns { string } the sentence
 * **/
export const generateSentence = ( digraphs, size ) => {
  
  console.debug( "generating sentence ..." );

  if( !size || size < 2 ) size = 9;

  let response = "";

  for( let i = 0; i < size; ++i ) {
    const sel1 = digraphs[ Math.floor( Math.random() * digraphs.length ) ];
    // for now, let's just do 1
    // but do another round in the future
    //const sel2 = Math.floor( Math.random() * digraphs.length );

    // i think this is killing the whole bot if it doesnt find a match

    // no user input here btw
    let words = execSync( `grep --color=never "${sel1}" /usr/share/dict/words` ).toString();
    if( words.length > 1 ) {
      words = words.split( "\n" );
      const chosenWord = words[ Math.floor( Math.random() * words.length ) ];
      console.debug( `Adding ${chosenWord} to response` );
      response += chosenWord + " ";
    }

  }
  console.debug( "result:", response );

  return( response );

};
