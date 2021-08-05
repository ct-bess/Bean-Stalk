import Command from "../struct/Command";
import * as system from "./modules/system";
import { spawn } from "child_process";

/**
 * Collection of OS and other system process commands.
 * Used to see metrics, reload commands, or terminate the client.
 * @extends Command
 * @see {@link module:system} for subcommands
 */
class System extends Command {

  constructor(
    CommandOptions = {
      name: "system",
      description: "Exclusive Bean Stalk sytemd commands",
      aliases: [ "bean", "systemd" ],
      modules: system
    }
  ) {
    super( CommandOptions );
  }

  /**
   * Executes an OS command and sends the response to the message's channel.
   * If a callback function is given, the response is handed to that callback instead of being sent to the message's channel.
   * Dude trsut me, there's no injection vulnerability here.
   * @method spawnProcess
   * @memberof System
   * @param {Message} message - the Discord Message calling this function
   * @param {string} command - the OS command to execute, such as `ls`
   * @param {array<string>} [cliargs=[]] - command line arguments to use, such as `-1`, and/or `-l`
   * @param {function} [callback] - a function to execute once the command has closed/finished
   * @returns {void}
   * @todo
   * might want to pass the message to the callback too
   */
  spawnProcess = ( message, command, cliargs = [], callback ) => {

    if( !command ) {
      console.warn( "System spawnProcess called with no command" );
      return;
    }

    let response = "";
    const proc = spawn( command, cliargs );
    proc.stdout.on( "data", data => {
      response += data.toString();
    });
    proc.stderr.on( "data", data => {
      response += data.toString();
    });
    proc.on( "close", code => {
      console.info( "System child process exited with code:", code );
      if( !!callback && ( callback instanceof Function ) ) {
        callback( response );
      }
      else if( response.length > 2000 ) {
        this.sendBulk( response, message, "code block" );
      }
      else {
        response = response.replaceAll( "`", "'" );
        message.send( "```\n" + response + "\n```" );
      }
    });

  }

}

export default new System();
