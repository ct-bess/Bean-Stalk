import { MessageActionRow, MessageSelectMenu } from "discord.js";
import Command from "../struct/Command";
import CommandOptions from "../../slashCommands/pokemon.json";
import { edGuild } from "../../secrets.json";
import biomes from "../../kb/pokemon/biomes.json";

/**
 * commands to support edward's amazing pokemon dnd
 */
class Pokemon extends Command {

  constructor() {
    super( CommandOptions );
    this.guild = edGuild;
  }

  /**
   * retrieve biome selector & await a response
   * then returns the list of biomes for the given habitat
   * finall, you select a habitat and then bean spits out a random encounter
   * @param {CommandInteraction} interaction - The command interaction
   */
  spawn = ( interaction ) => {

    const selectData = {
      placeHolder: "please select a biome",
      options: [],
      minValues: 1,
      maxValues: 1
    };

    for( const b in biomes ) {
      selectData.options.push({
        label: b,
        description: "awesome",
        value: b
      });
    }

    const selectMenu = new MessageSelectMenu( selectData );

    const response = { 
      content: "Biomes:",
      components: [
        new MessageActionRow( selectMenu )
      ]
    };

    return( response  );

  }

};

export default new Pokemon();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 */