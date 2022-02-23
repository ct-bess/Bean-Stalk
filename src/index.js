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

let isInitialized = false;

bot.on( "ready", () => {
  if( !isInitialized ) {
    console.info( "INITIATING BEAN STALK ..." );
    loadCommands( bot, true );
    postSlashCommands( bot );
    bot.user.setStatus( "idle" );
    bot.user.setActivity( "mc server offline", { type: "WATCHING" } );
    isInitialized = true;
  }
  else {
    console.info( "Bean Stalk has restarted" );
  }
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
  }
});

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean Throttle:", rateLimitInfo );
});

bot.on( "error", ( error ) => {
  // do we need to re-login?
  bot.login( token );
  bot.user.setStatus( "dnd" );
  const channel = bot.guilds.resolve( homeGuildId )?.channels.cache.find( channel => /^b[o0]t/i.test( channel?.name ) );
  if( !!channel ) {
    channel.send( "`" + error.name + ": " + error.message + "`" ).catch( console.error );
  }
  else {
    console.info( "no guild channel found to post error to" );
  }
});

process.on( "SIGTERM", () => {
  console.info( "Bean Stalk terminating ..." );
  bot.destroy();
  console.info( "Bean Stalk successfully logged out" );
  process.exit( 0 );
});

bot.login( token );
