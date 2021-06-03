import { Client, Collection } from "discord.js";
import guild from "../../guild.json";

/**
 * @class Bot
 * @description The Discord client this program runs, AKA the bot
 * @extends Discord.Client
 * @constructor ClientOptions
 * @property { Discord.Collection } commands a map of commands that the bot can execute
 * @property { Object } var an object of useful bot variables for ease of access
 * **/
class Bot extends Client {

  constructor( ClientOptions ) {

    super( ClientOptions );
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
    }

  } // EO constructor

}; // EO Bat

export default Bot;
