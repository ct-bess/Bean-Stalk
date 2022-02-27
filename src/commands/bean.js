import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/bean.json";
import { postSlashCommands } from "../util/clientUtil";
import Response from "../struct/Response";
import { interactionMethods } from "../util/constants"
import { execSync } from "child_process";
import { testGuild } from "../../secrets.json";

/**
 * very safe bean system commands
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
        return( new Response( interactionMethods.UPDATE, {
            // this is safe
            content: interaction.message.content + ` ${selected}`
          })
        );
      }
    }
  }

  status = () => {
    const response = "```\n" + execSync( "systemctl status bean" ).toString() + "\n```";
    return({ method: "reply", payload: response });
  }

  logs = ( interaction ) => {
    const lines = parseInt( interaction.options.getNumber( "lines" ) ) || 15;
    const response = "```\n" + execSync( `journalctl -n ${lines} --no-pager -u bean` ).toString() + "\n```";
    return({ method: "reply", payload: response });
  }

  /**
   * post slash command
   * @param {CommandInteraction} interaction - The command interaction
   */
  post_command = ( interaction ) => {

    const commandName = interaction.options.getString( "command" );
    let response = new Response();
    response.method = interactionMethods.REPLY;

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

      response.payload = { content: "Select a command:", components: this.buildSelectMenu( selectData ), ephemeral: true }
    }

    return( response );

  }

};

export default new Bean();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 */