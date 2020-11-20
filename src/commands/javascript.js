import { exec } from "child_process";
import { sendBulk } from "../sendBulk.js";

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js" ],
  exec( message, bot ) {
    let response = "";
    let code = message.content.replace( /-js\s|-javascript\s/, "" );
    const isAdmin = bot.var.admins.includes( message.author.id );
    console.debug( "JavaScript:\n", code );

    if( /require|import/i.test( code ) && !isAdmin ) {
      message.reply( "BruH :fire: no" );  
    }
    else {

      message.channel.startTyping();

      if( !isAdmin ) {
        code = code.replace( /^(?:\s+)?"/, "console.log('Yall Mind If I Alter Your Injection Attempt')" );
        code = code.replace( /(?:\s+)?#(?:\s+)?$/, "console.log('Yall Mind If I Alter Your Injection Attempt')" );
        code = code.replace( /"/g, "'" );
      }

      // This is extremely vulnerable to injection --> code = " && ifconfig && echo "Got'em" #
      let process = exec( `node --harmony -e "${code}"`, ( error, stderr, stdout ) => {
        if( !!error ) {
          response = `${error.name} ${bot.var.emojis.lmao}\n` + "```diff\n" + error.message + "\n```";
        }
        else response = stderr || stdout;
        message.channel.stopTyping();
      });

      console.debug( "exec spawned with PID:", process.pid, "&&", process.pid + 1 );
      console.debug( "args:", ...process.spawnargs );

      // To kill infinite loops and code that takes too long
      setTimeout( () => {

        // There's 2 processes to kill????? well Bettati never taught javascript
        if( !process.killed ) {
          process.kill();
        }
        exec( `kill ${process.pid + 1}` );
        console.debug( "js subprocesses killed" );

        if( response.length > 2000 ) sendBulk( response, message, null );
        else message.channel.send( !!response.length ? response : "empty stdout :triumph:" );
        message.channel.stopTyping();

      }, 3000 );

    }

  }

};
