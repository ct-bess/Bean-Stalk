import auth from "../auth.json";
import guild from "../guild.json";
import { logPath, logFile, logLevel } from "../config.json";
import { messageOps } from "./messageOps";
import { execCommand, handleEvent } from "./util/clientUtil";
import { loadCommands, validateGuild } from "./util/systemUtil";
import Bot from "./struct/Bot";
import Logger from "./struct/Logger";
import "./struct/SaferMessage";

console = new Logger( `${logPath}/${logFile}`, logLevel );
console.info( "Logger created with output path:", console.logStream.path, "with level:", console.getLevel() );

const bot = new Bot({
  disableMentions: "everyone",
  messageEditHistoryMaxSize: 0
});

bot.on( "ready", () => {
  console.log( "INITIATING BEAN STALK ..." );
  loadCommands( bot, false );
  validateGuild( bot );
  console.info( "Bean-Stalk started @", ( new Date().toISOString() ) );
});

bot.on( "message", ( message ) => {


  const prefixCheck = message.content.startsWith( bot.var.config.prefix );
  const allowedBots = bot.var.bots.includes( message.author.id );

  if( bot.var.messageOpsEnabled && !prefixCheck && message.author.id !== bot.user.id ) messageOps( message, bot );

  if( message.channel.type === "dm" && !message.author.bot && !prefixCheck ) {
    setTimeout( () => {
      bot.channels.resolve( bot.var.channels.commands ).send( message.content );
    }, 1000 );
    return;
  }

  if( !prefixCheck || ( !allowedBots && message.author.bot ) ) return;

  execCommand( message, bot );
  
});

bot.setInterval( () => {
  handleEvent( bot );
}, 60000 );

bot.on( "presenceUpdate", ( oldPresence, newPresence ) => {
  try {
    const who = (!!oldPresence ? oldPresence.userID : newPresence.userID) + "";
    // this will trigger multiple times if bean & user are in multiple servers; Check the guild to stop this
    if( who === bot.var.members.kenny || who === bot.var.members.emmy ) {
      //const risingEdge = !!oldPresence && oldPresence.status === "offline" && newPresence.status === "online";
      const risingEdge = !oldPresence && newPresence.status === "online";
      const fallingEdge = !!oldPresence && oldPresence.status === "online" && newPresence.status === "offline";
      console.debug( "Kenny Emmy Presence ~", "rising edge:", risingEdge, "falling edge:", fallingEdge );
      if( risingEdge === true ) {
        if( who === bot.var.members.emmy ) {
          console.info( "Emmy logged in bro" );
          bot.channels.resolve( bot.var.channels.commands ).send( "Happy birthday Emmy!" );
          bot.user.setActivity( "ONE WINGED KONG" );
        }
        else {
          console.info( "Kenny logged in bro" );
          bot.channels.resolve( bot.var.channels.kenny ).send( `Hi ${bot.var.roles.kenny}` );
          bot.user.setActivity( "KENNY SPOTTED" );
        }
      }
      if( fallingEdge === true ) {
        if( who === bot.var.members.emmy ) {
          console.info( "Emmy logged out :'[" );
          bot.user.setActivity( "SEE YOU DK" );
        }
        else {
          console.info( "Kenny logged out :'[" );
          bot.user.setActivity( "SEE YOU SPACE MIATA" );
        }
      }
    }
  }
  catch( error ) {
    console.error( "Kenny detection error:", error );
  }
});

bot.on( "messageDelete", ( message ) => {
  console.info( "message deleted", message.author.username, message.content );
  if( !message.author.bot && message.content.length > 0 ) message.channel.send( message.content );
});

bot.on( "channelCreate", ( channel ) => {
  if( channel.type === "dm" ) channel.send( "Hey scuse me big guy. I heard some noises goin on in here, couple minutes ago" );
  else if( channel.isText() ) {
    channel.send( "Nice place" );
    channel.setTopic( ":sweat_drops:" );
  }
});

bot.on( "guildMemberAdd", ( member ) => {
  const joinedGuild = bot.guilds.resolve( member.guild.id );
  if( !!joinedGuild ) {
    // this will probly break if there are no channels
    const veryStableGeneral = joinedGuild.channels.cache.first();
    const perm = veryStableGeneral.permissionsFor( bot.user.id );
    if( veryStableGeneral.isText() && perm.has( "SEND_MESSAGES" ) ) {
      veryStableGeneral.send( `${guild.welcomeVideo} <@!${member.id}> :sweat_drops:` );
    }
  }
});

bot.on( "rateLimit", ( rateLimitInfo ) => {
  console.warn( "Bean's Being Throttled", rateLimitInfo );
});

bot.login( auth.token );
