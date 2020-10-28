import Discord from "discord.js";
import auth from "../auth.json";
import help from "../help.json";
import { loadCommands } from "./loadCommands.js";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on( "ready", () => {
  loadCommands( bot, null );
  console.info( "Commands:", bot.commands );
  console.info( `Bean Stalk is in: ${bot.user.tag}` );
});

bot.on( "message", ( message ) => {

  // FYI: apparently the proper way to get a custom emoji is this:
  // message.guild.emojis.cache.get("12345678...")

  if( /16:20|0?4:?20|w[e3]{2,}d/i.test( message.content ) ) {
    message.react( ":blunt:766311145341845504" );
  }

  const prefixCheck = message.content.startsWith( "-" );

  if( message.createdTimestamp % 69 === 0 ) {
    message.react( "\u0036\u20E3" );
    message.react( "\u0039\u20E3" );
  }
  // 0x5f3759df = 99841437 in base ten
  else if( message.createdTimestamp % 0x5f3759df === 0 ) message.reply( "**// what the fuck?** https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_math.c#L552" );

  if( !prefixCheck || message.author.bot ) return;

  const commandArgs = message.content.slice( 1 ).toLowerCase().split( /\s+/, 2 );
  const command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );
  
  console.debug( "[DEBUG] -", "User:", message.author.username, "Content:", message.content );

  if( !command ) {
    message.reply( "bruHh" );
    return;
  }

  try {
    if( /^-?-?h(?:elp)?$/i.test( commandArgs[1] ) ) {
      const helpEmbed = help[command.name] || {};
      helpEmbed.color = 0xffea00;
      helpEmbed.title = command.name + "";
      helpEmbed.description = command.description + "";
      helpEmbed.footer = {};
      helpEmbed.footer.text = "aliases: " + command.aliases.join(', ');
      message.channel.send({ embed: helpEmbed });
    }
    else {
      command.exec( message, bot );
    }
  }
  catch( error ) {
    console.error( error );
    message.reply( "**WHO DID THIS?!?!** :joy:\n" + "```diff\n" + error + "\n```" );
  }
  
});

bot.login( auth.token );
