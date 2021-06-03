import { spawn } from "child_process";
import { sendBulk } from "../util/commandUtil";

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js", "js-nl" ],
  exec( message, bot ) {
    const isAdmin = bot.var.admins.includes( message.author.id );
    const args = message.content.split( /\s+/, 2 );
    const code = message.content.substring( ( args[0] + "" ).length + 1 );
    const formatNewlines = args[0] === this.aliases[1]; // wow

    if( /require|import/.test( code ) && !isAdmin ) {
      message.reply( "Don't use external modules :fire:" );  
    }
    else {

      let delay = 1500;
      console.info( "Starting child process with base delay:", delay, "milliseconds" );
      message.channel.startTyping();

      // RIP OS Injection (Bashdoor; CWE-78): 2020-2021 "Admins are no longer worthy"
      const cliargs = [ "--harmony", "-e", code ];
      let process = spawn( "node", cliargs );

      process.stdout.on( "data", data => {

        let stdout = data.toString();
        delay += 1500;

        // this looks kinda gross now
        if( formatNewlines ) {
          stdout = stdout.split( "\n" );
          for( let i = 0; i < stdout.length; ++i ) {
            if( stdout[i].length > 0 ) {
              setTimeout( () => {
                if( stdout[i].length < 2000 ) message.channel.send( stdout[i] );
                else sendBulk( stdout[i], message, null );
              }, delay );
              delay += 1500;
            }
          }
        }
        else {
          setTimeout( () => {
            if( stdout.length < 2000 ) message.channel.send( stdout );
            else sendBulk( stdout, message, null );
          }, delay );
        }

      });

      process.stderr.on( "data", data => {
        const stderr = data.toString();
        delay += 1500;
        setTimeout( () => {
          message.channel.send( bot.var.emojis.lmao + "\n```diff\n" + stderr + "\n```" );
        }, delay );
      });

      process.on( "close", code => {
        console.info( "spawn finished with exit code:", code );
      });

      console.debug( "child process spawned with PID:", process.pid )
      console.debug( "args:", process.spawnargs );

      // To kill infinite loops and code that takes too long
      // we'll wait until double the delay amount
      setTimeout( () => {

        if( !process.killed ) {
          process.kill();
        }
        // There is probly 2 processes? a node proc & a bash proc?
        // this hasn't killed a random process on my computer?
        //exec( `kill ${process.pid + 1}` );
        console.info( "js subprocesses killed" );
        console.info( "max delay reached:", delay, "ms" );

        message.channel.stopTyping();

      }, delay*2 );

      console.info( "Process will be manually killed in", delay*2, "ms" );

    }

  }

};
