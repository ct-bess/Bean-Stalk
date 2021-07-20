import Command from "../struct/Command";
import { spawn } from "child_process";

/**
 * Use to execute Node.js subprocesses from Bean Stalk.
 * No subcommands here, everything after the command is used for the Node.js subprocess.
 * Run as the `js-nl` alias to detatch stdout buffer and put each line to a new message.
 * Doing so will greatly increase the output delay.
 * @extends Command
 */
class JavaScript extends Command {

  constructor(
    name = "javascript",
    description = "Execute some spicy, arbitrary, uncontainiarized JavaScript\nEverything after command is treated as JavaScript :tm:",
    aliases = [ "js", "js-nl" ]
  ) {
    super( name, description, aliases );
  }

  /**
   * Spawns JavaScript with Node.js subprocess, try to inject an OS command I dare you.
   * Admins can use `require` and `import`
   * @method exec
   * @override
   * @memberof JavaScript
   * @this Command
   * @param {Message} message - Discord Message orgin
   * @param {Bot} bot - Discord Client
   * @returns {void}
   */
  exec = ( message, bot ) => {

    const isAdmin = this.hasRole( message.author.id, bot, "admin" );
    const invokedName = ( message.content.split( /\s+/, 2 )[0] + "" );
    const code = message.content.substring( invokedName.length + 1 );
    const formatNewlines = invokedName === this.aliases[1]; // wow

    // also means you can't have a string with "require" or "import"
    if( /require|import/.test( code ) && !isAdmin ) {
      console.warn( "js called with external modules by non-admin:", message.author.id, message.author.username );
      message.reply( "Don't use external modules :fire:" );  
      return;
    }

    let delay = 1500;

    console.info( "Starting node subproc with base delay:", delay, "ms" );
    message.channel.startTyping();

    // RIP OS Injection (Bashdoor; CWE-78): 2020-2021 "Admins are no longer worthy"
    const cliargs = [ "--harmony", "-e", code ];
    const proc = spawn( "node", cliargs );

    proc.stdout.on( "data", data => {

      let stdout = data.toString();
      if( stdout.length > 0 ) {

        delay += 1500;

        // Puts each instance of "stdout" to a new Message
        if( formatNewlines ) {

          stdout = stdout.split( "\n" );
          for( let i = 0; i < stdout.length; ++i ) {

            if( stdout[i].length > 0 ) {

              setTimeout( () => {
                if( stdout[i].length < 2000 ) {
                  message.send( stdout[i] );
                }
                else {
                  this.sendBulk( stdout[i], message );
                }
              }, delay );

              delay += 1500;

            }

          }

        }

        // Dumps the entire buffers contents in 1 message
        else { 

          setTimeout( () => {
            if( stdout.length < 2000 ) {
              message.send( stdout );
            }
            else {
              this.sendBulk( stdout, message );
            }
          }, delay );

        }

      }

    }); // EO proc.stdout.on data

    proc.stderr.on( "data", data => {

      const stderr = data.toString();
      if( stderr.length > 0 ) {

        delay += 1500;

        setTimeout( () => {
          message.reply( bot.var.emojis.lmao + "\n```diff\n" + stderr + "\n```" );
        }, delay );

      }

    });

    proc.on( "close", code => {
      console.info( "subprocess finished with exit code:", code );
    });

    console.debug( "child proc spawned with PID:", proc.pid, "using args:", proc.spawnargs )

    // To kill infinite loops and code that takes too long
    // we'll wait until double the delay amount
    const timeoutDelay = delay * 2;

    setTimeout( () => {

      if( !proc.killed ) {
        proc.kill();
      }

      console.info( "node subproces killed?", proc.killed );
      console.info( "max delay reached:", delay, "ms" );

      message.channel.stopTyping();

    }, timeoutDelay );

    console.info( "Process will be manually killed in", timeoutDelay, "ms" );

  }

};

export default new JavaScript();

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */
