import Command from "../struct/Command";
import * as system from "./modules/system";
import { spawn } from "child_process";

class System extends Command {

  constructor(
    name = "system",
    description = "Exclusive Bean Stalk sytemd commands",
    aliases = [ "bean", "systemd" ],
    modules = system
  ) {
    super( name, description, aliases, modules );
  }

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
      if( callback && typeof( callback ) === "function" ) {
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
