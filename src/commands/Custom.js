import { execSync, spawnSync } from "child_process";

export default {
  name: "custom",
  aliases: [ "cc" ],
  description: "Write a custom command for Bean to execute. This is such a bad idea :skull:",
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/, 3 );
    args.shift();
    const subcommand = args[0].toLowerCase();
    const commandName = ( args[1] || "" ).toLowerCase();
    let lineNumber = null; //parseInt( args[2] || "" );
    let script = message.content.match( /(?<=(?:\w+\s+){3})(\d+\s+)?(.+)/ );
    console.debug( "Using:", subcommand, commandName );

    if( !!script ) { 
      if( /require|import/.test( script ) ) {
        message.reply( "DoNt Do that" );
        return;
      }
      lineNumber = parseInt( script[1] || "" );
      script = script[2];
      console.debug( "script:", script );
      console.debug( "at line number:", lineNumber || "EO exec" );
    }

    let cliargs = [];
    let cmd = null;
    let response = "";

    switch( subcommand ) {
      case "list":
        cmd = "ls";
        cliargs = [ "lib/commands/.ccs", "src/commands/.ccs" ];
        response += "```console\n";
        break;
      case "show":
        cmd = "cat";
        cliargs = [ "-n", `src/commands/.ccs/${commandName}.js` ];
        response += "```js\n";
        break;
      case "new":
        // This will nuke duplicate commandName's BTW
        cmd = "cp";
        cliargs = [ 
          "src/commands/.ccs/template", 
          `src/commands/.ccs/${commandName}.js`,
        ];
        response += `Creating new command \`${commandName}\` ...`;
        break;
      case "commit":
        cmd = "babel";
        cliargs = [ 
          `src/commands/.ccs/${commandName}.js`,
          "-o",
          `lib/commands/.ccs/${commandName}.js`
        ];
        break;
      case "edit":
        cmd = "sed";
        cliargs = [ 
          "-E",
          "-i",
          "--sandbox",
          script,
          `src/commands/.ccs/${commandName}.js`,
        ];
        response += `Editing ${commandName} with script \`${script}\` ...`;
        break;
      case "append":
        if( !lineNumber ) lineNumber = parseInt( execSync( `cat src/commands/.ccs/${commandName}.js | wc -l` ).toString() ) - 2;
        script = script.replace( "/", "\\/\\/" );
        cmd = "sed";
        cliargs = [ 
          "-E",
          "-i",
          "--sandbox",
          `${lineNumber},${lineNumber}s/(.*)/\\1\\n${script}/`,
          `src/commands/.ccs/${commandName}.js`,
        ];
        response += `Appending \`${script}\` at ${lineNumber} to ${commandName} ...`;
        break;
      case "enable":
      case "disable":
      case "upload":
      case "download":
      default:
        response = `Invalid subcommand ${subcommand}`;
    }

    if( !!cmd ) {
      const proc = spawnSync( cmd, cliargs );
      console.debug( "proc.pid", proc.pid );
      if( !!proc.stdout ) response += proc.stdout
      else if( !!proc.stderr ) response += "```diff\n" + proc.stderr + "\n```"
      else if( !!proc.error ) response += `:joy: **${proc.error.name}** :joy:\n` + "```diff\n" + proc.error.message + "\n```";

      // -- Very Wet Indeed -- \\
      if( subcommand === "show" || subcommand === "list" ) {
        response += "\n```";
      }
      else if( subcommand === "new" ) {
        execSync( `sed -i -E --sandbox s/template/${commandName}/g src/commands/.ccs/${commandName}.js` );
      }
      else if( subcommand === "commit" ) {
        if( !!require.cache[ require.resolve( `./.ccs/${commandName}.js` ) ] ) delete require.cache[ require.resolve( `./.ccs/${commandName}.js` ) ];
        const command = require( `./.ccs/${commandName}` );
        bot.commands.set( command.default.name, command.default );
        response += `Committed \`${commandName}\`; give it a spin :cyclone:`;
      }

    }

    console.debug( "Custom output:", subcommand, response );
    message.channel.send( !!response ? response : "Empty response :triumph:" );

  }

};
