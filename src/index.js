import { postSlashCommands } from "./util/clientUtil";
import { loadCommands } from "./util/systemUtil";
import { Intents } from "discord.js";
import { token, admins, homeGuildId } from "../secrets.json";
import Bot from "./struct/Bot";

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

  postSlashCommands( bot );

  bot.user.setStatus( "idle" );
  bot.user.setActivity( "mc server offline", { type: "WATCHING" } );
});

bot.on( "interactionCreate", ( interaction ) => {

  if( !interaction.isCommand() ) return;

  const commandName = interaction.commandName;

  if( bot.commands.has( commandName ) ) {
    const command = bot.commands.get( commandName );
    command.exec( interaction );
  }
  else {
    console.info( "interaction command name not found:", commandName );
  }

});

bot.on( "messageDelete", ( message ) => {
  console.info( "message deleted, oh nonono!", message.author.username, message.content );
  if( !message.author.bot && message.content.length > 0 ) message.channel.send( message.content );
});

bot.on( "channelCreate", ( channel ) => {
  if( channel.type === "dm" ) channel.send( "Hey scuse me big guy. I heard some noises goin on in here, couple minutes ago" );
  else if( channel.isText() ) {
    channel.send( "Nice place" );
    channel.setTopic( ":sweat_drops:" );
  }
});

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean Throttle:", rateLimitInfo );
});

process.on( "SIGTERM", () => {
  console.info( "Bean Stalk terminating ..." );
  bot.destroy();
  console.info( "Bean Stalk successfully logged out" );
  process.exit( 0 );
});

bot.login( token );
