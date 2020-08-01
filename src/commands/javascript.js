import { exec } from "child_process";

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js" ],
  options: [],
  examples: [],
  exec( message, bot ) {
    let response = "BruHHhhH";
    let process;
    let code = message.content.replace( /-js|-javascript/, "" );
    code = message.content.replace( "'", '"' );

    if( /require|import/i.test( code ) ) {
      message.reply( "BruH :fire: no" );  
    }
    else {

      process = exec( `node --harmony -e '${code}'`, {}, ( error, stdout, stderr ) => {
        response = error || stderr || stdout;
      });

      console.debug( "exec spawned with PID:", process.pid );

      setTimeout( () => {
        // There's 2 processes to kill, or i'm just ungabunga
        if( !process.killed ) {
          process.kill();
        }

        exec( `kill ${process.pid + 1}` );

        if( response.length > 0 ) {
          message.channel.send( response );
        }
        else {
          message.channel.send( "empty stdout :triumph:" );
        }

      }, 3000 );

      // This locks up the entire bot if someone writes bad code
      //const response = execSync( `node --harmony -e "${code}"` ).toString();
      //message.channel.send( response );
    }

  }

};
