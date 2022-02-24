import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/pokemon.json";
import { edGuild } from "../../secrets.json";
import biomes from "../../kb/pokemon/biomes.json";
import habitats from "../../kb/pokemon/habitats.json";

/**
 * commands to support edward's amazing pokemon dnd
 */
class Pokemon extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = edGuild;
  }
  
  /**
   * Handles select menu updates
   * @todo this looks disgusting
   * @param {SelectMenuInteraction} interaction - The interaction
   */
  pokemon = ( interaction ) => {

    if( interaction.isSelectMenu() ) {

      if( interaction.customId === `${this.name}-biomeSelector` ) {
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

        const response = {
          type: "update",
          payload: { 
            content: `Habitates of: *${selected}*`,
            components: [
              this.buildSelectMenu( selectData )
            ]
          }
        };

        return( response );

      } // EO biome selector callback

      if( interaction.customId === `${this.name}-habitatSelector` ) {

        const selected = interaction.values[0];

        /** @type {array} */
        const pokemons = habitats[selected];
        console.debug( "total number of possible encounters:", pokemons.length );
        const sel = Math.floor( Math.random() * pokemons.length );
        const isShiny = Math.floor( Math.random() * 8193 ) === 1;
        console.debug( "selected:", sel, "=", pokemons[sel] );
        return({ 
          type: "update", 
          payload: { 
            content: `random encounter: **${pokemons[sel]}**` + isShiny ? ":sparkles: (shiny)" : "",
            components: []
          }
        });

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

    const response = {
      type: "reply",
      payload: { 
        content: "Biomes:",
        components: [
          this.buildSelectMenu( selectData )
        ]
      }
    };

    return( response );

  }

};

export default new Pokemon();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').SelectMenuInteraction} SelectMenuInteraction
 */