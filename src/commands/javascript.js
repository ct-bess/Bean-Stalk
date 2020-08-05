import { exec } from "child_process";

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js" ],
  options: [],
  examples: [],
  exec( message, bot ) {
    let response = "";
    let code = message.content.replace( /-js\s|-javascript\s/, "" );
    console.debug( "JavaScript:\n", code );

    if( /require|import/i.test( code ) ) {
      message.reply( "BruH :fire: no" );  
    }
    else {

      message.channel.startTyping();

      code = code.replace( /^(?:\s+)?"/, "console.log('Yall Mind If I Alter Your Injection Attempt')" );
      code = code.replace( /(?:\s+)?#(?:\s+)?$/, "console.log('Yall Mind If I Alter Your Injection Attempt')" );
      code = code.replace( /"/g, "'" );

      // This is extremely vulnerable to injection --> code = " && ifconfig && echo "Got'em" #
      let process = exec( `node --harmony -e "${code}"`, ( error, stderr, stdout ) => {
        if( !!error ) {
          response = `${error.name} <:lma0:705790110318329928>\n` + "```diff\n" + error.message + "\n```";
        }
        else response = stderr || stdout;
        message.channel.stopTyping();
      });

      console.debug( "exec spawned with PID:", process.pid, "&&", process.pid + 1 );
      console.debug( "args:", ...process.spawnargs );

      // To kill infinite loops and code that takes too long
      setTimeout( () => {

        // There's 2 processes to kill, or i'm just ungabunga
        if( !process.killed ) {
          process.kill();
        }
        exec( `kill ${process.pid + 1}` );
        console.debug( "js subprocesses killed" );

        message.channel.send( !!response.length ? response : "empty stdout :triumph:" );
        message.channel.stopTyping();

      }, 3000 );

    }

  }

};
