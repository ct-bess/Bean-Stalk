import { Collection } from "discord.js";
import { spawnSync, execSync } from "child_process";

export default {
  name: "dndutil",
  aliases: [ "dnd" ],
  description: "A collection of DnD utilities",
  options: [
    "`check <stat> <?times>`\tRoll a check using your character's stat (3 letter abbreviation) `str`, `int`, `dex`, ...",
    "`save <stat> <?times>`\tRoll a saving throw using your character's stat (3 letter abbreviation) `str`, `int`, `dex`, ...",
    "`show <?what>`\tDisplay your character's `inventory`, `stats`, `profs`, `actions`",
    "`load <?all>`\tLoads the save data of the player; Defaults to your character",
  ],
  examples: [],
  players: new Collection(),
  exec( message, bot ) {
    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    const subCommand = args[0].toLowerCase() || "lmao";
    let response = "";
    switch( subCommand ) {
      case "r":
      case "roll":
      case "check":
      case "save":
        const rollCount = parseInt( args[2] ) || 1;
        const stat = args[1] || "";
        if( !stat.length ) {
          response = "No stat given: use `str`, `int`, ... ";
        }
        else if( !!this.players.has( message.author.username ) ) {
          const playerStat = this.players.get( message.author.username ).stats[stat];
          if( !!playerStat && typeof( playerStat ) === "number" ) {
            const min = 1, max = 20;
            const rollValue = bot.commands.get( "dice" ).roll( max, min, rollCount, message.author );
            const modifier = Math.floor( playerStat / 2 ) - 5;
            response = `d${max} x${rollCount} *with modifier ${modifier}* `;
            if( subCommand === "save" ) {
              const isProf = this.players.get( message.author.username ).profs.includes( stat );
              const savingThrow = rollValue + ( parseInt( isProf + 0 ) * 2 ) + modifier;
              response += `:pray: ${isProf ? "*PROFICIENT BTW*" : ""} ${message.author}\n**${savingThrow}**`;
            }
            else {
              const total = rollValue + modifier;
              response += `:game_die: ${message.author}\n**${total}**`;
            }
            if( rollValue == max || rollValue == min ) response += " *nat btw*";
          }
          else response = `No such stat \`${stat}\`, or invalid stat data type \`${typeof(playerStat)}\``;
        }
        else {
          response = `No such player \`${message.author.username}\``;
        }
        break;
      case "show":
        const showArg = args[1] || "";
        const content = this.players.get( message.author.username )[showArg] || "";
        if( !!content && !!showArg ) {
          for( const key in content ) {
            if( typeof( content[key] ) === "object" ) {
              response += `**${key}**:\n`;
              for( const nestedKey in content[key] ) {
                response += `\`${nestedKey}\`: ${content[key][nestedKey]}\n`;
              }
            }
            else response += `\`${key}\`: ${content[key]}\n`;
          }
        }
        else response = "No such player :joy: or arg";
        break;
      case "register":
        break;
      case "load":
        const character = require( `../../kb/dnd/${message.author.username}.json` );
        this.players.set( message.author.username, character );
        response = `**Big Load** on ${message.author.username}'s character`;
        break;
      default:
        response = `No such subcommand ${subCommand}`;
    }
    message.channel.send( !!response.length ? response : "Empty :triumph:" );
  }
};
