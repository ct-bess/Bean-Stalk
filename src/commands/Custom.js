import { execSync, spawnSync } from "child_process";
import { writeFile } from "fs";
import { get } from "https";

export default {
  name: "custom",
  aliases: [ "cc" ],
  description: "Write a custom command for Bean to execute. This is such a bad idea :skull:",
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/, 3 );
    args.shift();
    const subcommand = (args[0]+"").toLowerCase();
    let commandName = ( args[1] || "" ).toLowerCase();
    const hasCommand = bot.commands.has( commandName );
    let lineNumber = null; //parseInt( args[2] || "" );
    let script = message.content.match( /(?<=(?:\w+\s+){3})(\d+\s+)?(.+)/ );
    console.debug( "Using:", subcommand, commandName );

    if( !!script ) { 
      if( /require|import/.test( script ) ) {
        message.reply( "external libraries are UNEPIC" );
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

    switch( subcommand + (hasCommand + 0) ) {
      case "show0":
      case "delete0":
      case "remove0":
      case "edit0":
      case "append0":
      case "download0":
        const emoji = [ ":flushed:", ":sunglasses:", ":face_with_monocle:" ][ Math.floor( Math.random() * 3 ) ];
        response = `so you want to ${subcommand} ${commandName} that doesn't exist or is uncommitted? ${emoji}`;
        break;
      case "list0":
      case "list1":
        cmd = "ls";
        cliargs = [ "lib/commands/.ccs", "src/commands/.ccs" ];
        response += "```\n";
        break;
      case "show1":
        cmd = "cat";
        cliargs = [ "-n", `src/commands/.ccs/${commandName}.js` ];
        response += "```js\n";
        break;
      case "new1":
        response = `already have *${commandName}* :sunglasses:`;
        break;
      case "new0":
        cmd = "cp";
        cliargs = [ 
          "src/commands/.ccs/template", 
          `src/commands/.ccs/${commandName}.js`,
        ];
        response += `Creating new command \`${commandName}\` ...`;
        break;
      case "upload0":
      case "upload1":
        console.debug( message.attachments );
        get( message.attachments.first().url, resp => {
          let data = "";
          resp.on( "data", chunk => { data += chunk } );
          resp.on( "error", error => { 
            console.error( `GET error:`, error );
            message.reply( "bruH the netowrk died or something" );
          });
          resp.on( "end", () => {
            commandName = !!commandName ? commandName + ".js" : message.attachments.first().name;
            commandName = commandName.toLowerCase();
            console.debug( `Writing ${commandName} ...` );
            if( /require|import/.test( data ) ) message.reply( "don't use external libraries" );
            else {
              writeFile( `src/commands/.ccs/${commandName}`, data, error => {console.error(error)} );
              message.channel.send( `created **${commandName}** from your upload :grimacing: commit it next` );
            }
          });
        });
        break; // remove this break if we ever want to chain upload with commit, gotta await that get tho
      case "commit1":
      case "commit0":
        cmd = "babel";
        cliargs = [ 
          `src/commands/.ccs/${commandName}.js`,
          "-o",
          `lib/commands/.ccs/${commandName}.js`
        ];
        break;
      case "edit1":
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
      case "append1":
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
      case "delete1":
        cmd = "mv";
        cliargs = [
          `src/commands/.ccs/${commandName}.js`,
          `src/commands/.ccs/decom/${commandName}${message.createdTimestamp}.js`,
          "&&",
          `rm lib/commands/.ccs/${commandName}.js`
        ];
      case "remove1":
        response = `${subcommand}ing *${commandName}* :flushed:\n${ subcommand === "remove" ? "Re-commit to restore" : "GONE"}`;
        bot.commands.delete( commandName );
        break;
      case "download1":
        message.channel.send({
          files: [{
            attachment: `src/commands/.ccs/${commandName}.js`,
            name: `${commandName}.js`
          }]
        });
        break;
      default:
        response = `Invalid subcommand ${subcommand} :face_with_monocle:`;
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
      else if( subcommand === "commit" ) { //|| subcommand === "upload" ) {
        if( !!require.cache[ require.resolve( `./.ccs/${commandName}.js` ) ] ) delete require.cache[ require.resolve( `./.ccs/${commandName}.js` ) ];
        const command = require( `./.ccs/${commandName}` );
        bot.commands.set( command.default.name, command.default );
        response += `Committed \`${commandName}\`; give it a spin :cyclone:`;
      }

    }

    console.debug( "Custom output:", subcommand, response );
    if( response.length > 0 ) message.channel.send( response );
    else console.warn( "empty response in Custom.js exec" );

  }

};
