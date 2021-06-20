import { Client, Collection } from "discord.js";
import guild from "../../guild.json";

/**
 * @typedef {import('discord.js').Message} Message
 * 
 * @typedef {object} Command
 * @property {string} name - the command's name called by users; No spaces here or else it will never be found when calling it
 * @property {Array<string>} aliases - alternative command names for execution; No spaces here too
 * @property {string} description - a short description of the command; Full documentation is in help.json
 * @property {function(Message,Bot)} exec - executes the command for the user based on the bot state and message contents
 */

/**
 * A subclass of Discord.Client to include a selection of config variables
 * @extends Client
 * @see {@link Client}
 * @property {Collection<string,Command>} commands - a map of commands that the bot can execute
 * @property {object} var - an object of useful bot variables for ease of access
 * @property {boolean} var.messageOpsEnabled - wether or not to respond to non commands with regex responses
 * @property {object} var.config - configuration variables defined in config.json; Loaded seperatly
 * @property {string} var.guild - client's home server ID
 * @property {object} var.emojis - hardcoded list of emojis, name & ID
 * @property {object} var.roles - hardcoded list of roles
 * @property {object} var.members - hardcoded list of members in home server
 * @property {Array<string>} var.admins - an array of the client's admins to run extreme commands
 * @property {Array<string>} var.bots - an array of bots for client to listen to
 * @property {object} var.events - list of time sensitive client events defined in events.json; Loaded seperatly
 * @property {object} var.channels - hard coded list of channels
 */
class Bot extends Client {

  /**
   * @typedef {import('discord.js').ClientOptions} ClientOptions
   * @param {ClientOptions} ClientOptions - Discord.Client ClientOptions
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
