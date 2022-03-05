import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/pokemon.json";
import Response from "../struct/Response";
import Constants from "../util/constants";
import { edGuild, testGuild } from "../../secrets.json";
import biomes from "../../kb/pokemon/biomes.json";
import habitats from "../../kb/pokemon/habitats.json";
import stats from "../../kb/pokemon/stats.json";
import { MessageEmbed } from "discord.js";

/**
 * commands to support edward's amazing pokemon dnd
 */
class Pokemon extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = [ edGuild, testGuild ];
  }

  /**
   * Handles select menu updates
   * @todo this looks disgusting
   * @param {SelectMenuInteraction|ButtonInteraction} interaction - The interaction
   */
  pokemon = ( interaction ) => {

    if( interaction.isSelectMenu() ) {

      console.debug( "menu selector:", interaction.customId );

      if( /biomeSelector/i.test( interaction.customId ) ) {
        const selected = interaction.values[0];
        console.debug( "biome selector vaue:", selected );
        const habitat = biomes[selected];

        console.debug( "total number of possible habitats:", habitat.length );

        const selectData = {
          customId: `${this.name}-habitatSelector`,
          placeHolder: "please select a habitat for: " + selected,
          options: [],
          minValues: 1,
          maxValues: 1
        };

        for( const b of habitat ) {
          selectData.options.push({
            label: b,
            value: b
          });
        }

        return(
          new Response( Constants.interactionMethods.UPDATE, {
              content: `Habitates of: *${selected}*`,
              components: this.buildSelectMenu( selectData )
            }
          )
        );

      } // EO biome selector callback

      if( /habitatSelector/i.test( interaction.customId ) ) {

        const selected = interaction.values[0];

        /** @type {array} */
        const pokemons = habitats[selected];
        console.debug( "total number of possible encounters:", pokemons.length );
        const sel = Math.floor( Math.random() * pokemons.length );
        const isShiny = ( Math.floor( Math.random() * 8192 ) + 1 ) === 1;
        const pokemon = ( pokemons[sel] + "" ).trim();

        console.debug( "selected:", sel, "=", pokemon );

        // if shiny, add a mf like button
        return(
          new Response( Constants.interactionMethods.UPDATE, { 
              content: `random encounter: **${pokemon}**${isShiny ? " :sparkles:" : ""} from *${selected}*`,
              components: []
            }
          )
        );

      } // EO habitat selector callback

    } // EO interaction isSelectMenu

  }

  /**
   * retrieve biome selector to start random encounter spawn process
   * @param {CommandInteraction} interaction - The command interaction
   */
  spawn = ( interaction ) => {

    const selectData = {
      customId: `${this.name}-biomeSelector`,
      placeHolder: "please select a biome",
      options: [],
      minValues: 1,
      maxValues: 1
    };

    for( const b in biomes ) {
      selectData.options.push({
        label: b,
        value: b
      });
    }

    return(
      new Response( Constants.interactionMethods.REPLY, {
          content: "Biomes:",
          components: this.buildSelectMenu( selectData )
        }
      )
    );

  }

  /**
   * get help text for the given item, monster, move, or ability
   * @param {CommandInteraction} interaction - The command interaction
   */
  help = ( interaction ) => {

    const pokemon = interaction.options.getString( "pokemon" )?.toLowerCase();
    //const item = interaction.options.getString( "item" );
    //const move = interaction.options.getString( "move" );
    //const ability = interaction.options.getString( "ability" );
    const response = new Response( Constants.interactionMethods.REPLY );

    /* yep ype yep
    [ $1 "No.", 
    $2 "Type 1",
    $3 "Type 2",
    $4 "Base HP",
    $5 "Strength", $6 "Max Strength",
    $7 "Dexterity", $8 "Max Dexterity",
    $9 "Vitality", $10 "Max Vitality",
    $11 "Special", $12 "Max Special",
    $13 "Insight", $14 "Max Insight",
    $15 "Ability 1", $16 "Ability 2", $17 "Hidden Ability", $18 "Event Abilities",
    $19 "Unevolved", $20 "Form",
    $21 "Recommended Rank",
    $22 "Gender" ],
    */
    if( !!stats.monsters[pokemon] ) {

      let p = stats.monsters[pokemon];

      if( p[0] instanceof Array ) {
        const form = interaction.options.getString( "form" )?.toLowerCase();
        p = p.find( elem => ( elem[19] + "" ).toLowerCase() === form ) ?? p[0];
      }

      const embed = new MessageEmbed();
      embed.setTitle( pokemon + ( !!p[19] ? "(" + p[19] + ") " : " " ) + "No. " + p[0] );
      embed.addField( "Type", p[1] + " " + ( p[2] ?? "" ), true );
      embed.addField( "Stats", `Base HP: ${p[3]}\nStr: ${p[4]}/${p[5]}\nDex: ${p[6]}/${p[7]}\nVit: ${p[8]}/${p[9]}\nSpec: ${p[10]}/${p[11]}\nIns: ${p[12]}/${p[13]}` );
      embed.addField( "Abilities", p[14] + ( !!p[15] ? ", or " + p[15] : "", true ) )
      embed.addField( "Hidden/Event Abilities", ( p[16] ?? "n" ) + ( p[17] ?? "a", true ) );
      embed.addField( "Recommended Rank:", p[20], true );
      embed.addField( "Gender:", p[21], true );
      response.payload.embeds = embed;

    }
    else {
      console.info( "stats missing for:", pokemon );
      response.payload.content = `stats for *${pokemon}* does not exist in Bean's data`;
      response.payload.ephemeral = true;
    }

    return( response );

  }

};

export default new Pokemon();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 */