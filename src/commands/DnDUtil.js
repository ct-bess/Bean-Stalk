import { Collection } from "discord.js";
import { spawnSync, execSync } from "child_process";

export default {
  name: "dndutil",
  aliases: [ "dnd" ],
  description: "A collection of DnD utilities",
  options: [
    "`check <stat> <?times>`\tRoll a check using your character's stat (3 letter abbreviation) `str`, `int`, `dex`, ...",
    "`save <stat> <?times>`\tRoll a saving throw using your character's stat (3 letter abbreviation) `str`, `int`, `dex`, ...",
    "`hit <equipment> <?times>`\tRoll a hit die using your character's equipment object: `mainhand`, `offhand` ...",
    "`dmg <equipment> <?times>`\tRoll a dammage die using your character's equipment object: `mainhand`, `offhand` ...",
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
    DnDUtil: switch( subCommand ) {
      case "check":
      case "save":
      case "hit":
      case "dmg":
        const rollCount = parseInt( args[2] ) || 1;
        const rollArg = args[1] || "";
        if( !rollArg.length ) {
          response = "No roll arg given: use `str`, `int`, ... for `save` and `check`\n";
          response += "use `mainhand`, `offhand`, ... for `hit` and `dmg`";
        }
        else if( !!this.players.has( message.author.username ) ) {

          let playerStat = 0;

          // Player object should be verified at the JSON level

          if( subCommand === "save" || subCommand === "check" ) {
            playerStat = this.players.get( message.author.username ).stats[rollArg];
          }
          else { // subcommand === hit || dmg
            const equipStat = this.players.get( message.author.username ).equip[rollArg].stat;
            playerStat = this.players.get( message.author.username ).stats[equipStat];
          }

          if( !!playerStat && typeof( playerStat ) === "number" ) {

            const modifier = Math.floor( playerStat / 2 ) - 5;
            const min = 1;
            let max = 0;
            let total = modifier;

            if( subCommand === "dmg" ) {
              const dmgDie = this.players.get( message.author.username ).equip[rollArg].dmgDie;
              if( !dmgDie || typeof( dmgDie ) !== "number" ) {
                response = `Invalid dammage die: \`${dmgDie}\`, or dammage die data type: \`${typeof(dmgDie)}\``;
                break DnDUtil;
              }
              else
                max = dmgDie;
            }
            else if( subCommand === "hit" ) {
              const hitModifier = this.players.get( message.author.username ).equip[rollArg].hit;
              if( !hitModifier || typeof( hitModifier ) !== "number" ) {
                response = `Invalid equip hit: \`${hitModifier}\`, or equip hit data type: \`${typeof(hitModifier)}\``;
                break DnDUtil;
              }
              else {
                total += hitModifier;
                max = 20;
              }
            }
            else max = 20;

            // How do we do bonuses? dueling, rage, bardic inspiration?

            response = `d${max} x${rollCount} *with modifier ${total}* `;
            const rollValue = bot.commands.get( "dice" ).roll( max, min, rollCount, message.author );

            if( subCommand === "save" ) {

              const isProf = this.players.get( message.author.username ).profs.includes( rollArg );
              const savingThrow = rollValue + ( parseInt( isProf + 0 ) * 2 ) + modifier;
              response += `:pray: ${isProf ? "*PROFICIENT BTW*" : ""} ${message.author}\n**${savingThrow}**`;

            }

            else { // subcommand === check || hit || dmg
              total += rollValue;
              response += `:game_die: ${message.author}\n**${total}**`;
            }

            if( rollValue == max || rollValue == min ) response += " *(nat btw)*";

          }
          else response = `No such arg \`${rollArg}\`, or invalid arg data type \`${typeof(playerStat)}\``;
        }
        else {
          response = `No such player \`${message.author.username}\``;
        }
        break;
      case "cast":
      case "spell":
        break;
      case "rest":
        // Short and Long rest to restore actions
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
