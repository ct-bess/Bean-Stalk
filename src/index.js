import { loadCommands, loadEvents } from "./util/systemUtil";
import { Intents } from "discord.js";
import { token, admins, homeGuildId } from "../secrets.json";
import Bot from "./struct/Bot";
import Constants from "./util/constants";

const bot = new Bot({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS
  ],
  disableMentions: "everyone",
  messageEditHistoryMaxSize: 0,
  homeGuildId,
  admins
});

bot.on( "ready", () => {

  console.info( "INITIATING BEAN STALK ..." );
  loadCommands( bot, true );
  loadEvents( bot );
  bot.user.setStatus( "idle" );
  bot.user.setActivity( "mc server sleep", { type: "WATCHING" } );
  bot.tryEvents( "random" );

});

bot.on( "interactionCreate", ( interaction ) => {

  try {
    let commandName = null;

    if( interaction.isCommand() ) {
      commandName = interaction.commandName;
    }
    else if( interaction.isSelectMenu() || interaction.isButton() ) {
      commandName = interaction.customId?.split( "-" )[0];
    }
    else {
      console.info( "Unknown interaction:", interaction.type.toString() );
      return;
    }

    if( bot.commands.has( commandName ) ) {
      const command = bot.commands.get( commandName );
      command.exec( interaction );
    }
    else if( bot.events.random.has( commandName ) ) {
      const event = bot.events.random.get( commandName );
      event.handleInteraction( interaction );
    }
    else {
      console.info( "interaction command name not found:", commandName );
    }
  }
  catch( error ) {
    if( interaction.createdTimestamp % 69 === 0 ) {
      interaction.user.createDM().then( channel => channel.send( "real and straight brother" ) );
    }
    console.error( error );
    bot.postError( error );
  }

});

bot.on( "messageCreate", ( message ) => {
  bot.tryEvents( "random", message.channel );
});

bot.on( "messageDelete", ( message ) => {
  if( !message.author.bot && message.content.length > 0 ) {
    message.channel.send( message.content );
  }
});

bot.on( "messageUpdate", ( oldMessage, newMessage ) => {

  bot.tryEvents( "random", newMessage.channel );

  if( !newMessage.author.bot && !!newMessage.editable && oldMessage.content.length > 0 ) {
    setTimeout( () => {
      newMessage.edit( oldMessage.content );
    }, Constants.time.TWO_SECONDS );
  }

});

bot.on( "channelCreate", ( channel ) => {
  if( channel.type === "dm" ) {
    channel.send( "Hey scuse me big guy. I heard some noises goin on in here, couple minutes ago" );
  }
  else if( channel.isText() && channel.permissionsFor( bot.user.id ).has( 1 << 11 ) ) {
    channel.send( "Nice place" );
    bot.tryEvents( "random", channel );
  }
});

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean Throttle:", rateLimitInfo );
});

bot.on( "error", ( error ) => {
  bot.postError( error );
});

process.on( "SIGTERM", () => {
  bot.tryEvents( "random" );
  console.info( "Bean Stalk terminating ..." );
  bot.destroy();
  console.info( "Bean Stalk successfully logged out" );
  process.exit( 0 );
});

bot.login( token );
