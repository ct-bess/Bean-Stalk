import { spawnSync } from "child_process";

// full disclosure: I have no idea what I'm doing here
// I just remember rundell saying you could recite shakespear with digraph frequency

/** 
 * @method createDigraphs
 * @description loops thru an array of strings and creates an array of digraphs used in each string
 * @param { array<string> } messages the messages to check
 * @returns { array<string> } the array of digraphs; No frequencies, just all digraphs including duplicates
 * **/
export const createDigraphs = ( messages ) => {
  console.debug( "creating digraphs ..." );
  const digraphs = [];
  for( const message of messages ) {

    for( let i = 0; i < message.length - 1; ++i ) {
      const digraph = ( message[i] + message[i+1] + "" ).toLowerCase();
      if( /[a-z]{2}/.test( digraph ) ) {
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
  
  console.debug( "generating sentence from digraphs ..." );

  if( !size || size < 2 ) size = 9;

  let response = "";

  for( let i = 0; i < size; ++i ) {
    const sel1 = digraphs[ Math.floor( Math.random() * digraphs.length ) ];

    let words = "";

    let cliargs = [ "-h", "--color=never", sel1, "/usr/share/dict/words" ];

    if( Math.floor( Math.random() * 2 ) === 1 ) {
      const sel2 = digraphs[ Math.floor( Math.random() * digraphs.length ) ];
      cliargs = [ ...cliargs, "|", "grep", "-h", "--color=never", sel2 ];
    }

    // could use a spawn but I'd have to promisfy then Promise.all it
    const process = spawnSync( "grep", cliargs );
    if( !!process.stdout ) {
      words = process.stdout.toString().split( "\n" );
      const chosenWord = words[ Math.floor( Math.random() * words.length ) ];
      response += chosenWord + " ";
    }

  }

  console.debug( "result:", response );

  return( response );

};
