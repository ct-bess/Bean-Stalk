import { Client, Collection } from "discord.js";
import guild from "../../guild.json";

/**
 * A subclass of Discord.Client to include a selection of config variables.
 * Mainly just a bunch of hardcoded IDs
 * @extends Client
 * @property {Collection<string,Command>} commands - a map of {@link Command}s that the bot can execute
 * @property {Object} var - an object of useful bot variables for ease of access
 * @property {boolean} var.messageOpsEnabled - wether or not to respond to non commands with regex responses
 * @property {Object} var.config - configuration variables defined in config.json; Loaded seperatly
 * @property {string} var.guild - client's home server ID
 * @property {Object} var.emojis - hardcoded list of emojis, name & ID
 * @property {Object} var.roles - hardcoded list of roles
 * @property {Object} var.members - hardcoded list of members in home server
 * @property {Array<string>} var.admins - an array of the client's admins to run extreme commands
 * @property {Array<string>} var.bots - an array of bots for client to listen to
 * @property {Object} var.events - list of time sensitive client events defined in events.json; Loaded seperatly
 * @property {Object} var.channels - hard coded list of channels
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
    this.var = {
      messageOpsEnabled: true,
      config: null,
      guild: guild.id,
      emojis: guild.emoji,
      roles: guild.roles,
      members: guild.members,
      admins: guild.admins,
      bots: guild.bots,
      events: null,
      channels: guild.channels
    };

  } // EO constructor

}; // EO Bat

export default Bot;

/**
 * @typedef {import('discord.js').ClientOptions} ClientOptions
 */
