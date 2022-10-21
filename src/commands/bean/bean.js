import Command from "../../struct/Command";
import CommandOptions from "./options";
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

    const interactionName = interaction.customId?.split( "-" )[1];

    if( interaction.isSelectMenu() ) {

      const selectedValue = interaction.values[0] + "";
      let content = "";
      switch( interactionName.toLowerCase() ) {
        case "postcommand":
          content = `posting: ${selectedValue}`;
          postSlashCommands( interaction.client, selectedValue );
          break;
        case "triggerevent":
          const eventType = selectedValue.split( "-" )[1];
          const eventName = selectedValue.split( "-" )[0];
          content = `triggering: ${eventName}`;
          interaction.client.tryEvents({ type: eventType, name: eventName, force: true, channel: interaction.channel });
          break;
        default:
          console.info( "No such interaction name:", interactionName, "for customId:", interaction.customId );
          return;
      }

      console.info( content );
      return( new Response( Constants.interactionMethods.UPDATE, { content } ) );

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
    // IMAGINE if lines somehow could be a string and you could inject a malicious bash command
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
        customId: `${this.name}-postCommand`,
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
   * manualy trigger bean events
   * MAYBE we should collapse this w/post_command
   * @param {CommandInteraction} interaction - The command interaction
   */
  trigger_event = ( interaction ) => {

    let response = new Response();
    response.method = Constants.interactionMethods.REPLY;
    // this is not good
    const datetimeEvents = interaction.client.events.datetime.map( event => { return({
        label: event.name,
        value: event.name + "-" + event.type,
        description: event.type
    })});
    const randomEvents = interaction.client.events.random.map( event => { return({
        label: event.name,
        value: event.name + "-" + event.type,
        description: event.type
    })});

    const selectData = {
      customId: `${this.name}-triggerEvent`,
      placeHolder: "please select an event",
      options: [ ...datetimeEvents, ...randomEvents ],
      minValues: 1,
      maxValues: 1
    };

    response.payload = { content: "Select an event ... ", components: ComponentUtil.buildSelectMenus( selectData ), ephemeral: true }

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
   * rebuild: git pull --> sudo systemctl restart bean
   */
  rebuild = () => {
  }

  /**
   * Create admin console
   * bunch of buttons and menus do do the following:
   * force trigger a specific event
   */
  admin_console = () => {
  }

};

export default new Bean();

/**
 * @typedef {import('../../struct/Bot').default} Bot
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 */