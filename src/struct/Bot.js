import { Client, Collection, MessageEmbed, Constants } from "discord.js";

/**
 * A subclass of Discord.Client to include a selection of config variables.
 * Mainly just a bunch of hardcoded IDs
 * @extends Client
 * @property {Collection<string,Command>} commands - a map of {@link Command}s that the bot can execute
 */
class Bot extends Client {

  /**
   * @param {ClientOptions} ClientOptions - Discord Client ClientOptions
   */
  constructor( ClientOptions ) {

    super( ClientOptions );

    /**
     * @type {Collection<string,Command>}
     */
    this.commands = new Collection();
    this.admins = ClientOptions.admins;
    this.homeGuildId = ClientOptions.homeGuildId;

  } // EO constructor

}; // EO Bot

export default Bot;

/**
 * @typedef {import('discord.js').ClientOptions} ClientOptions
 */
