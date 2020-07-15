/* for now this is just gonna slap on a random
 * line from the text file
 */

import { execSync } from "child_process";
const ifs = "kb/radiant/oblivion.txt";

export default {
  name: "radiant",
  description: "Prints out a spicy Radiant AI quote `-radiant <?number>`",
  aliases: [ "rad" ],
  exec( message, args ) {
    const lineCount = execSync( `wc -l ${ifs}` ).toString().split( /\s/ )[0];
    const sel = parseInt( args[0] ) || Math.floor( Math.random() * ( lineCount - 0 ) ) + 1;
    let response = "";
    if( !sel || !lineCount ) {
      response = `Bad data: \`selector = ${sel}\` and \`line count = ${lineCount}\``;
    }
    else if( sel == 1 ) {
      response = execSync( `sed 2,${lineCount}d ${ifs}` ).toString();
    }
    else {
      response = execSync( `sed 1,${sel}d ${ifs} | sed 2,${lineCount}d` ).toString();
    }
    message.channel.send( `${response} \`${sel} / ${lineCount}\`` );
  }
};
