import { exec } from "child_process";
import { sendBulk } from "../sendBulk.js";

// here's a better remediation
//import { writeFileSync } from "fs"
//writeFileSync( "temp.js", code, error => { console.error(error) });

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js" ],
  exec( message, bot ) {
    let response = "";
    //let code = message.content.replace( /-js\s|-javascript\s/, "" );
    const isAdmin = bot.var.admins.includes( message.author.id );

    const args = message.content.split( /\s+/, 2 );
    console.debug( "args:", args );

    const formatNL = !!args[1] && (args[1]+"").substring(1) === "newlines";
    let code = formatNL ? message.content.substring( args[0].length + args[1].length + 2 ) : message.content.substring( args[0].length + 1 );

    console.debug( "output on new lines?", formatNL, "\nJavaScript:\n", code );

    if( /require|import/i.test( code ) && !isAdmin ) {
      message.reply( "Don't use external modules :fire:" );  
    }
    else {

      message.channel.startTyping();

      if( !isAdmin ) {
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

      //bot.user.setActivity( process.pid + " +1", { type: "WATCHING" } );

      // I want to set an immediate that outputs the result as soon as it's ready
      // And I want to keep the timeout to kill koders

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

        if( formatNL && response.length > 0 ) {
          response = response.split( "\n" );
          for( const r of response ) { 
            if( !!r ) {
              //message.channel.send( r ); 
              setTimeout( () => {message.channel.send( r )}, 300 );
            }
          }
        }
        else if( response.length > 2000 ) sendBulk( response, message, null );
        else message.channel.send( !!response.length ? response : "empty stdout :triumph:" );
        message.channel.stopTyping();
       // bot.user.setActivity( "" );

      }, 3000 );

    }

  }

};
