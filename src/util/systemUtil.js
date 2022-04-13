import { readdirSync } from "fs";
/**
 * Governs various file sytem functions
 * @module systemUtil
 */

/** 
 * imports all or one command module into the bot. Overwrites the require cache if the command was already imported
 * @function loadCommands
 * @param {Bot} bot - client to load to
 * @param {boolean} [override] - wether to override existing commands or not. If true, rejects setting a command if the bot already has a command with that name or alias
 * @param {string} [commandName] - the name of one command to load. Defaults to all commands
 * @returns {void}
 */
export const loadCommands = ( bot, override, commandName ) => {

  console.debug( "loading commands with override:", override );

  /**
   * @param {string} name - directory name, which is the command name
   */
  const checkAndSet = ( name ) => {

    const path = `../commands/${name}/${name}.js`;

    try {

      if( !!require.cache[ require.resolve( path ) ] ) {
        delete require.cache[ require.resolve( path ) ];
      }

      const command = require( path );
      let validCommand = !!override;

      if( !validCommand ) {
        validCommand = !bot.commands.has( command.default.name );
      }

      if( validCommand ) {
        console.debug( "Setting command:", command.default.name );
        bot.commands.set( command.default.name, command.default );
      }
      else {
        console.error( "Cannot set command; Already has command name included in:", command.default.name );
        delete require.cache[ require.resolve( path ) ];
      }

    }
    catch( error ) {
      console.error( error );
      console.error( "Check the exports for:", name, "and the path:", path );
    }

  }

  if( !!commandName ) {
    checkAndSet( commandName );
  }
  else {
    const commandDirectories = readdirSync( "lib/commands" );

    for( const dir of commandDirectories ) {
      if( !!dir ) {
        checkAndSet( dir );
      }
    }

  }

};

/**
 * @typedef {import('../struct/Bot').default} Bot
 */
