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
      throw new Error( "Subcommand name cannot be null or empty" );
    }
    if( !SubcommandOptions.exec ) {
      throw new Error( "No subcommand exec function given" );
    }
    if( !( SubcommandOptions.exec instanceof Function ) ) {
      throw new Error( "subcommand exec must be a function" );
    }
    if( !SubcommandOptions.help ) {
      console.warn( "No help text supplied to subcommand:", SubcommandOptions.name );
    }

    this.name = ( SubcommandOptions.name + "" ).toLowerCase().replaceAll( " ", "_" );
    this.help = SubcommandOptions.help;
    this.onlyAdmins = !!SubcommandOptions.onlyAdmins;
    this.exec = SubcommandOptions.exec;

  }

}

export default Subcommand;
