import Command from "../struct/Command";
import { exec, execSync } from "child_process";
import { minecraftIP } from "../../secrets.json";
import CommandOptions from "../../slashCommands/minecraft.json";
import { homeGuildId } from "../../secrets.json";

/**
 * This command is dependent on a minecraft server being registered with the host's systemd
 * and opening up a stdin path to execute in game console commands
 * @todo dynamically determine how much RAM to allocate in mc args ie. it shouldn't break if we run on a micro vs. medium instance size
 */
class Minecraft extends Command {

  #canStart = true;
  #canStop = false;

  constructor() {
    super( CommandOptions );
    this.guild = homeGuildId;
  }

  /**
   * starts the server; anyone can execute this
   * @param {CommandInteraction} interaction - The command interaction
   */
  start = ( interaction ) => {

    let response = "";

    if( this.#canStart ) {

      const startstatus = execSync( "sudo systemctl start minecraft" ).toString();

      if( startstatus.length > 0 ) {
        response = "bruh error: " + startstatus;
      }
      else {
        console.info( "server is starting successfully" );
        response = "Starting server, wait a few minutes king";

        interaction.client.user.setActivity( "minecraft", { type: "PLAYING" } );
        interaction.client.user.setStatus( "online" );

        this.#canStart = false;

        setTimeout( () => {
          this.#canStop = true;
          console.info( "we can stop mc server now" );
        }, 5*60000 );
      }
    }
    else {
      response = "chill out brother. server's already on or is in the process of stopping";
    }

    return({ method: "reply", payload: response });

  }

  /**
   * stops the server; user must be an admin to execute this
   * @param {CommandInteraction} interaction - The command interaction
   */
  stop = ( interaction ) => {

    let response = "";

    if( !this.#canStart && interaction.client.admins.includes( interaction.user.id ) ) {
      if( this.#canStop ) {

        const stopstatus = execSync( "sudo systemctl stop minecraft" ).toString();

        if( stopstatus.length > 0 ) {
          console.info( "stop failed, check logs" );
          response = "server stop failed: " + stopstatus;
        }
        else {
          console.info( "stop successful" );
          response = "I sleep ...";

          interaction.client.user.setActivity( "mc server offline", { type: "WATCHING" } );
          interaction.client.user.setStatus( "idle" );

          this.#canStop = false;

          setTimeout( () => {
            this.#canStart = true;
            console.info( "we can start the server agian now awesome" );
          }, 5*60000 );
        }
      }
      else {
        response = "don't try to start it and immediatly bait and switch to stop it bro";
      }
    }
    else {
      response = "nope";
    }

    return({ method: "reply", payload: response });
  }

  /**
   * add a user to the server whitelist; anyone can execute this.
   * shouldn't create duplicate entries if you try to add the same person twice
   * @param {CommandInteraction} interaction - The command interaction
   */
  whitelist = ( interaction ) => {
    let response = "";
    const username = interaction.options.getString( "username" ).replaceAll( "'", "" );
    if( username.length > 0 ) {
      // VERY SAFE
      exec( `sudo echo '/whitelist add ${username}' > /run/mcsrv/stdin` );
      response = "adding: " + username;
      console.info( "new user added to whitelist:", username );
    }
    else {
      console.info( "cannot add an empty/null username" );
    }
    return({ method: "reply", payload: response });
  }

  /**
   * fetch server logs; Can specify how many lines to get
   * @param {CommandInteraction} interaction - The command interaction
   */
  logs = ( interaction ) => {
    let response = "";

    let lines = interaction.options.getNumber( "lines" );
    lines = parseInt( lines, 10 ); // in theory the user can only give us a number
    if( !!lines ) {
      // if lines = 1 ~/.bashrc ; kill `pgrep node` # then we could have an issue
      response = execSync( `tail -n ${lines} /home/bessellc/mc-server/logs/latest.log` ).toString();
    }
    else {
      response = execSync( "tail /home/bessellc/mc-server/logs/latest.log" ).toString();
    }

    response = "```\n" + response + "\n```";
    return({ method: "reply", payload: response });
  }

  /**
   * let literally anyone post any message to the entire server
   * @param {CommandInteraction} interaction - The command interaction
   */
  say = ( interaction ) => {
    if( this.#canStop ) {
      const message = interaction.options.getString( "message" ).replaceAll( "'", "" );
      // Dont do this
      exec( `sudo echo '/say ${message}' > /run/mcsrv/stdin` );
      return({ content: "said: " + message, ephemeral: true });
    }
    else {
      return({ method: "reply", payload: { content: "server offline bruh", ephemeral: true } });
    }
  }

  /**
   * fetch server ip address
   */
  ip = () => {
    return({ method: "reply", payload: { content: `you dropped this king: **${minecraftIP}**`, ephemeral: true } });
  }

};

export default new Minecraft();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 */