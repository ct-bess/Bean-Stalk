/**
 * A collection of guild utility functions
 */
class GuildUtil {

  /** 
   * converts a name or snowflake ID to its' corresponding discord class
   * @function coalesce
   * @param {(string|Snowflake)} name - the user, channel, or role name or snowflake ID we are coalescing
   * @param {("channel"|"member"|"role")} type - what discord class type we are converting it
   * @param {Bot} [bot] - discord client processing this (not needed for member and role coalescing)
   * @param {Guild} [guild] - guild origin (not needed for channel coalescing)
   * @returns {?(Channel|Member|Role)} the Discord object with respect to the input type; If null the coalescing failed
   * @example
   * // convert text channel name to its' corresponding Discord.TextChannel object:
   * const channel = coalesce( "general", "channel", bot );
   * @example
   * // convert a member's ID to the member object from some guild:
   * const member = coalesce( "111111111111111111", "member", null, bot.guilds.cache.first() );
   */
  static coalesce = ( name, type, bot, guild ) => {

    type = ( type + "" ).toLowerCase() + ( /\d{18}/.test( name ) ? "Id" : "Name" );

    console.debug( "coalescing:", name, "to", type );

    let base = null;

    switch( type ) {
      case "channelId":
        base = bot.channels.resolve( name );
        break;
      case "channelName":
        base = bot.channels.cache.find( channel => channel.name === name );
        break;
      case "memberId":
        base = guild.members.resolve( name );
        break;
      case "memberName":
        base = guild.members.cache.find( member => member.user.username === name || member.nickname === name );
        break;
      case "roleId":
        base = guild.roles.resolve( name );
        break;
      case "roleName":
        base = guild.roles.cache.find( role => role.name === name );
        break;
      default:
        console.warn( "coalesce called on invalid type:", type );
    }

    return( base );

  }

  /**
   * Check if the user has the specified role.
   * @param {Snowflake} user - the user ID to check
   * @param {Bot} bot - our awesome Discord Client
   * @param {(Role|"admin")} role - the role to check; "admin" is a special case, admins are defined in the [Bot]{@link Bot.var.admins} class
   * @param {GuildResolvable} [guild] - Discord Guild to check role in; Ignored when checking for admin
   * @returns {?boolean} wether they have the role or not; Null on error
   * @todo
   * coalesce a role name into an ID if it's not admin. Maybe users too idk
   */
  static hasRole = ( userID, bot, role, guild ) => {

    let hasPerm = false;

    if( role === "admin" ) {
      hasPerm = bot.admins.includes( userID );
    }
    else {

      guild = bot.guilds.resolve( guild );

      if( guild ) {
        hasPerm = guild.roles.resolve( role )?.members?.has( userID ) ?? false;
      }

    }

    return( hasPerm );

  }

}

export default GuildUtil;

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Guild} Guild
 * @typedef {import('discord.js').GuildResolvable} GuildResolvable
 * @typedef {import('discord.js').Member} Member
 * @typedef {import('discord.js').Role} Role
 * @typedef {import('discord.js').Channel} Channel
 * @typedef {import('discord.js').Snowflake} Snowflake
 * @typedef {import('../struct/Bot').default} Bot
 */
