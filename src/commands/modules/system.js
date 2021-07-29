import { execSync } from "child_process";
import { exit } from "process";
import { writeFileSync, renameSync } from "fs"
import { loadCommands } from "../../util/systemUtil";
import Subcommand from "../../struct/Subcommand";

/**
 * {@link System} subcommands
 * @module system
 */

export const prefix = new Subcommand({

  name: "prefix",
  help: "`prefix` or expression: the new prefix to set to",
  onlyAdmins: true,

  /**
   * Changes the bot's prefix to almost anything
   * @this System
   */
  exec: function( args, message, bot ) {
    let newPrefix = args.get( "prefix" ) || args.get( 1 ) || bot.var.config.prefix;
    newPrefix = ( newPrefix + "" ).replaceAll( " ", "_" );
    bot.var.config.prefix = newPrefix;
    this.successReact( message );
  }

});

export const reload = new Subcommand({

  name: "reload",
  help: "expression: reloads specified command; Else all commands if nothing provided",
  onlyAdmins: true,

  /**
   * This only reloads the command now, not the modules
   * @this System
   */
  exec: function( args, message, bot ) {
    let response = "```fix\n";
    if( args.has( 1 ) ) {
      // -- Potential OS injection here
      const fileName = args.get( 1 );
      response += execSync( `babel src/commands/${fileName}.js -o lib/commands/${fileName}.js` ).toString() || fileName + "";
      loadCommands( bot, true, fileName );
      console.info( `Re-loaded ${fileName} command` );
    }
    else {
      response += execSync( "babel src/commands -d lib/commands" ).toString();
      loadCommands( bot, true );
      console.info( "Re-loaded all commands" );
    }
    response += "\n```\n:sweat_drops: **SIX** :sweat_drops: **HOT** :sweat_drops: **RELOADS** :sweat_drops:"
  }

});

export const die = new Subcommand({

  name: "die",
  help: "Terminates Bean Stalk :cry:",
  onlyAdmins: true,

  /**
   * Terminates the client
   * @this System
   */
  exec: function( args, message, bot ) {
    console.info( "saving events to: events.json ..." );
    writeFileSync( "events.json", JSON.stringify( bot.var.events, null, "  " ), error => { console.error(error) });

    console.info( "saving config to: config.json ..." );
    writeFileSync( "config.json", JSON.stringify( bot.var.config, null, "  " ), error => { console.error(error) });

    const date = new Date( message.createdTimestamp );
    let dateStamp = "" + date.getFullYear();
    dateStamp += date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    dateStamp += date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    //const logPath = `${bot.var.config.logPath}/${bot.var.config.logFile}`;
    const savedLogPath = `${bot.var.config.logPath}/${dateStamp}-${bot.var.config.logFile}`;

    console.info( `saving logs to: ${savedLogPath} ...` );
    // emit a drain if we ever go async or want to write some final logs from Logger on close emit
    console.logStream.end( "\nEnd of session @" + ( new Date().toISOString() ) );
    renameSync( console.logStream.path, savedLogPath );

    this.successReact( message );
    setTimeout( () => {
      bot.destroy();
      exit( 0 );
    }, 3000 );
  }

});

export const commands = new Subcommand({

  name: "commands",
  help: "List all commands loaded",

  /**
   * displays all Commands
   * @this System
   */
  exec: function( args, message, bot ) {
    const response = {
      embed: {
        color: 0xffea00,
        title: null,
        description: "awesome",
        fields: []
      }
    };
    response.embed.title = "Commands";
    response.embed.description = `Use prefix: \`${bot.var.config.prefix}\` to run`;
    bot.commands.forEach( command => {
      response.embed.fields.push({ name: command.name, value: command.description });
    });
    return( response );
  }

});

export const logs = new Subcommand({

  name: "logs",
  help: "`set`: set level to first argument\n`get` or `level`: gets current log level\nElse fetches last 10 logs, use `full` for all logs",

  /**
   * Log UI
   * @this System
   */
  exec: function( args, message, bot ) {
    let response = "";
    if( args.has( "set" ) ) {
      // admin check here btw
      response = console.setLevel( args.get( 1 ) );
      bot.var.config.logLevel = response || `Error setting to: ${args.get( 1 )}`;
    }
    else if( args.has( "get" ) || args.has( "level" ) ) {
      response = console.getLevel();
    }
    else {
      if( args.has( "full" ) ) {
        response = {
          files: [{
            attachment: `${bot.var.config.logPath}/${bot.var.config.logFile}`,
            name: bot.var.config.logFile
          }]
        };
      }
      // temp
      else {
        response = "```\n" + execSync( `tail -n 25 '${bot.var.config.logPath}/${bot.var.config.logFile}'` ).toString() + "\n```";
      }
    }
    return( response );
  }

});

export const channels = new Subcommand({

  name: "channels",
  help: "fetch all channels",

  /**
   * Fetch cached channels
   * @this System
   */
  exec: function( args, message, bot ) {
    const response = {
      embed: {
        color: 0xffea00,
        title: null,
        description: "awesome",
        fields: []
      }
    };
    const filter = c => c.type === "voice" || c.type === "text";
    bot.channels.cache.filter( filter ).forEach( channel => {
      if( !response.embed.title ) {
        response.embed.title = channel.guild.name
        response.embed.fields = [{ name: channel.name + ": " + channel.type, value: channel.id }]
      }
      else if( channel.guild.name !== response.embed.title ) {
        message.send( response );
        response.embed.title = channel.guild.name
        response.embed.fields = [{ name: channel.name + ": " + channel.type, value: channel.id }]
      }
      else {
        response.embed.fields.push({ name: channel.name + ": " + channel.type, value: channel.id });
      }
    });
    return( response );
  }

});

export const regex = new Subcommand({

  name: "regex",
  help: "Turn on or off random regex responses\n`on`: turns on\n`off` or no args: turns off",

  /**
   * Toggles regex responses
   * @this System
   */
  exec: function( args, message, bot ) {
    const ops = args.has( "on" ) ? true : false;
    bot.var.messageOpsEnabled = ops;
    bot.user.setStatus( ops ? "online" : "idle" );
    return( ops ? "Real shit??" : "I sleep" );
  }

});

/**
 * @todo
 * add server variable to allow changing nickname elsewhere
 */
export const nickname = new Subcommand({

  name: "nickname",
  help: "Change bean stalk's nickname in home server\nexpression: the nickname to change to, defaults to a random users name\n`awesome`: Use a random dictionary word as the nickname",

  /**
   * change bean stalk's nickname in home server
   * @this System
   */
  exec: function( args, message, bot ) {
    let nickname = args.get( 1 );
    if( !nickname ) {
      const randUser = message.guild.members.cache.random();
      if( !!randUser.nickname ) {
        nickname = nickname = randUser.nickname;
      }
      else {
        nickname = randUser.user.username;
      }
    }
    else if( args.has( "awesome" ) ) {
      const lineCount = parseInt( execSync( "wc -l /usr/share/dict/words" ).toString().split( " " )[0] );
      const sel = Math.floor( Math.random() * ( lineCount - 0 ) ) + 1;
      if( sel == 1 ) {
        nickname = execSync( `sed 2,${lineCount}d /usr/share/dict/words` ).toString();
      }
      else {
        nickname = execSync( `sed 1,${sel}d /usr/share/dict/words | sed 2,${lineCount}d` ).toString();
      }
    }
    console.debug( "setting nickname to:", nickname );
    bot.guilds.resolve( bot.var.guild ).members.resolve( bot.user.id ).setNickname( nickname );
  }

});

export const status = new Subcommand({
  name: "status",
  help: "get and set bean's status",
  exec: function( args, message, bot ) {
    const status = args.get( "status" ) || args.get( 1 );
    // not seeing a prop for user's statuses
    const type = args.has( "type" ) ? (args.get( "type" ) + "").toUpperCase() : "PLAYING";
    bot.user.setActivity( status, { type: type } );
  }
});

export const uptime = new Subcommand({
  name: "uptime",
  help: "display bean's uptime",
  exec: function( args, message, bot ) {
    const totMinutes = Math.floor( bot.uptime / 60000 );
    const minutes = Math.floor( totMinutes % 60 );
    const totHours = Math.floor( totMinutes / 60 );
    message.send( `${totHours < 10 ? "0"+totHours : totHours}:${minutes < 10 ? "0"+minutes : minutes}` );
  }
});

export const vrms = new Subcommand({
  name: "vrms",
  help: "display all non free packages installed on Bean's OS",
  /**
   * @this System
   */
  exec: function( args, message, bot ) {
    this.spawnProcess( message, "vrms" );
  }
});

export const screenfetch = new Subcommand({
  name: "screenfetch",
  help: "Grabs Bean's hardware and OS specs",
  /**
   * @this System
   */
  exec: function( args, message, bot ) {
    this.spawnProcess( message, "screenfetch", [ "-N" ] );
  }
});

export const sensors = new Subcommand({
  name: "sensors",
  help: "Run sensors command to view CPU and GPU temperatures",
  /**
   * @this System
   */
  exec: function( args, message, bot ) {
    this.spawnProcess( message, "sensors" );
  }
});

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('../struct/Bot').default} Bot
 */
