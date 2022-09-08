import Command from "../../struct/Command";
import CommandOptions from "./options.json";
import { postSlashCommands } from "../../util/clientUtil";
import Response from "../../struct/Response";
import Constants from "../../util/constants"
import { execSync } from "child_process";
import { testGuild } from "../../../secrets.json";
import ComponentUtil from "../../util/componentUtil";

/**
 * very safe bean system commands
 * @todo reload command
 */
class Bean extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = testGuild;
  }

  /**
   * @param {CommandInteraction} interaction - The command interaction
   */
  bean = ( interaction ) => {
    if( interaction.isSelectMenu() ) {
      if( /postCommand/i.test( interaction.customId ) ) {
        const selected = interaction.values[0] + "";
        postSlashCommands( interaction.client, selected );
        return( new Response( Constants.interactionMethods.UPDATE, {
            content: `Posted: **${selected}** ...`
          })
        );
      }
    }
  }

  status = ( interaction ) => {

    const status = interaction.options.getString( "status" )?.toLowerCase();
    let response = "";

    switch( status ) {
      case "service":
      response = "```\n" + execSync( "systemctl status bean" ).toString() + "\n```";
        break;
      case "specs":
      default:
        response = "```js\n" + execSync( "screenfetch -N" ).toString() + "\n```";
        break;
    }

    return( new Response( Constants.interactionMethods.REPLY, response ) );

  }

  logs = ( interaction ) => {
    const lines = parseInt( interaction.options.getNumber( "lines" ) ) || 15;
    const response = "```\n" + execSync( `journalctl -n ${lines} --no-pager -u bean` ).toString() + "\n```";
    return({ method: "reply", payload: response });
  }

  /**
   * post slash command. if no command is specified provides a dropdown of available commands to post
   * @param {CommandInteraction} interaction - The command interaction
   */
  post_command = ( interaction ) => {

    const commandName = interaction.options.getString( "command" );
    let response = new Response();
    response.method = Constants.interactionMethods.REPLY;

    if( !!commandName && interaction.client.commands.has( commandName ) ) {
      postSlashCommands( interaction.client, commandName );
      response.payload = { content: "done", ephemeral: true };
    }
    else {
      const selectData = {
        customId: `${this.name}-postCommandSelector`,
        placeHolder: "please select a command",
        options: interaction.client.commands.map( command => { return({
          label: command.name,
          value: command.name,
          description: command.description
        })}),
        minValues: 1,
        maxValues: 1
      };

      response.payload = { content: "Select a command ... ", components: ComponentUtil.buildSelectMenus( selectData ), ephemeral: true }
    }

    return( response );

  }

  /**
   * search for unused interactions and delete them
   * @param {CommandInteraction} interaction - The command interaction
   */
  prune_commands = ( interaction ) => {

    /** @type {Bot} */
    const bot = interaction.client;

    const response = bot.application.commands.fetch().then( commands => {

      const pruned = [];
      console.debug( "fetched:", commands.size, "commands for pruning ..." );

      commands.forEach( command => {
        console.debug( "processing command:", command.name );

        if( !bot.commands.has( command.name ) ) {
          console.info( "pruning:", command.name );
          bot.application.commands.delete( command.id );
          pruned.push( command.name );
        }
      });

      const content = pruned.length > 0 ? "Pruned: " + pruned.join( ", " ) : "No commands were pruned";
      return( new Response( Constants.interactionMethods.REPLY, content ) );

    }).catch( console.error );

    return( response );

  }

  /**
   * git pull --> sudo systemctl restart bean
   */
  rebuild = () => {
  }

};

export default new Bean();

/**
 * @typedef {import('../../struct/Bot').default} Bot
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 */