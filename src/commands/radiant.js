/* for now this is just gonna slap on a random
 * line from the text file
 */

import { execSync } from "child_process";
const ifs = "kb/radiant/oblivion.txt";

export default {
  name: "radiant",
  description: "",
  aliases: [],
  exec( message, args ) {
    const lineCount = execSync( `wc -l ${ifs}` ).toString().split( /\s/ )[0];
    const sel = Math.floor( Math.random() * ( lineCount - 1 ) ) + 1;
    let response = "";
    if( !!sel || !!lineCount ) {
      response = `Bad data: \`selector = ${sel}\` and \`line count = ${lineCount}\``;
    }
    if( sel == 1 ) {
      response = execSync( `sed 2,${lineCount}d ${ifs}` ).toString();
    }
    else {
      response = execSync( `sed 1,${sel}d ${ifs} | sed 2,${lineCount}d` ).toString();
    }
    message.channel.send( `${response}*${sel} / ${lineCount}*` );
  }
};
