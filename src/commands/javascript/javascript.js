import Command from "../../struct/Command";
import CommandOptions from "./options";

/**
 * Yes
 */
class Javascript extends Command {

  constructor() {
    super( CommandOptions );
  }

};

export default new Javascript();

/**
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 */