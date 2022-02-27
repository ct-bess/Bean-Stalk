import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/pokemon.json";
import Response from "../struct/Response";
import { interactionMethods } from "../util/constants";
import { edGuild, testGuild } from "../../secrets.json";
import biomes from "../../kb/pokemon/biomes.json";
import habitats from "../../kb/pokemon/habitats.json";

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
          new Response( interactionMethods.UPDATE, {
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
          new Response( interactionMethods.UPDATE, { 
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
      new Response( interactionMethods.REPLY, {
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

    const pokemon = interaction.options.getString( "pokemon" );
    const item = interaction.options.getString( "item" );
    const move = interaction.options.getString( "move" );
    const ability = interaction.options.getString( "ability" );

  }

};

export default new Pokemon();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 */