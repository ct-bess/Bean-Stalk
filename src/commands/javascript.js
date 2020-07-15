import { exec } from "child_process";

export default {
  name: "javascript",
  description: "Execute some spicy JavaScript\n-javascript <code>",
  aliases: [ "js" ],
  exec( message, args ) {
    let response = "BruHHhhH";
    let process;
    const code = message.content.replace( /-js/, "" );

    if( /require|import/i.test( code ) ) {
      message.reply( "BruH :fire: no" );  
    }
    else {

      //execSync( `echo \"${code}\" > test.js` );
      // could write to a file if we want to use "
      process = exec( `node --harmony -e "${code}"`, {}, ( error, stdout, stderr ) => {
        response = error || stderr || stdout;
      });

      console.debug( "exec spawned with PID:", process.pid );

      setTimeout( () => {
        // There's 2 processes to kill, or i'm just ungabunga
        if( !process.killed ) {
          process.kill();
        }
        exec( `kill ${process.pid + 1}` );
        message.channel.send( response || "empty :triumph:" );
      }, 3000 );

      // This locks up the entire bot if someone writes bad code
      //const response = execSync( `node --harmony -e "${code}"` ).toString();
      //message.channel.send( response );
    }

  }

};
