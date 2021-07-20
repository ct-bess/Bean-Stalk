/**
 * @typedef {object} SubcommandOptions
 * @property {string} name - subcommand's name
 * @property {string} help - subcommand's help text
 * @property {boolean} onlyAdmins - defines if only admins can execute this command
 * @property {function} exec - function that executes when subcommand's called
 */

/**
 * Subcommands are Commands of Commands, usually grouped with parent commands that fit their theme.
 * Subcommands are the 2nd argument provided, and are sometimes optional for their parent command's execution.
 * @property {string} name - subcommand's name. It's lower cased and spaces are replaced with underscores
 * @property {string} [help] - subcommand's help text
 * @property {boolean} [onlyAdmins=false] - defines if only admins can execute this command
 * @property {function} exec - function that executes when subcommand's called
 * @todo
 * considerations:
 * - Role restrictions so that it's not always only admins
 * - global and/or user cooldowns
 * - author
 */
class Subcommand {

  /**
   * @param {SubcommandOptions} SubcommandOptions
   */
  constructor( SubcommandOptions ) {

    if( !SubcommandOptions.name || SubcommandOptions.name?.length === 0 ) {
      throw "No subcommand name given";
    }
    if( !SubcommandOptions.exec ) {
      throw "No subcommand exec function given";
    }
    if( typeof( SubcommandOptions.exec ) !== "function" ) {
      throw "subcommand exec must be a function";
    }

    this.name = ( SubcommandOptions.name + "" ).toLowerCase().replaceAll( " ", "_" );
    this.help = SubcommandOptions.help;
    this.onlyAdmins = SubcommandOptions.onlyAdmins || false;
    this.exec = SubcommandOptions.exec;
  }

}

export default Subcommand;
