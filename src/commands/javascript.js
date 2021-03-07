import { exec, spawn } from "child_process";

export default {
  name: "javascript",
  description: "Execute some spicy, arbitrary, uncontainiarized JavaScript",
  aliases: [ "js" ],
  exec( message, bot ) {
    const isAdmin = bot.var.admins.includes( message.author.id );
    const args = message.content.split( /\s+/, 2 );
    const code = message.content.substring( args[0].length + 1 );

    if( /require|import/.test( code ) && !isAdmin ) {
      message.reply( "Don't use external modules :fire:" );  
    }
    else {

      let delay = 1500;
      console.info( "Starting child process with base delay:", delay, "milliseconds" );
      message.channel.startTyping();

      // RIP OS Injection: 2020-2021 "Admins are no longer worthy"
      const cliargs = [ "--harmony", "-e", code ];
      let process = spawn( "node", cliargs );

      process.stdout.on( "data", data => {
        // You need to be incrementing the delay to avoid a rate limit
        delay += 1500;
        console.info( data.toString() );
        setTimeout( () => {
          message.channel.send( data.toString() );
        }, delay );
      });

      process.stderr.on( "data", data => {
        delay += 1500;
        console.info( data.toString() );
        setTimeout( () => {
          message.channel.send( bot.var.emojis.lmao + "\n```diff\n" + data.toString() + "\n```" );
        }, delay );
      });

      process.on( "close", code => {
        console.info( "spawn finished with exit code:", code );
      });

      console.debug( "exec spawned with PID:", process.pid, "&&", process.pid + 1 );
      console.debug( "args:", ...process.spawnargs );

      // To kill infinite loops and code that takes too long
      // we'll wait until double the delay amount
      setTimeout( () => {

        // There's 2 processes to kill????? well Bettati never taught javascript
        if( !process.killed ) {
          process.kill();
        }
        // this hasn't killed a random process on my computer?
        exec( `kill ${process.pid + 1}` );
        console.info( "js subprocesses killed" );
        console.info( "max delay reached:", delay, "ms" );

        message.channel.stopTyping();

      }, delay*2 );

    }

  }

};
