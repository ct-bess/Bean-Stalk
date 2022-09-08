import { readdirSync, existsSync } from "fs";
/**
 * Governs various client module loading functions
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
   * note: require = relative to this file, fs = relative to node app dir
   * @param {string} name - directory name, which is the command name
   */
  const checkAndSet = ( name ) => {

    const path = `../commands/${name}/${name}.js`;

    if( !existsSync( `lib/commands/${name}/${name}.js` ) ) {
      console.info( `Skipping loading of lib/commands${name}/${name}.js ...` );
      return;
    }

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
 * reads and loads all events into client
 * @param {Bot} bot - client to load to
 * @returns {void}
 */
export const loadEvents = ( bot ) => {

  console.info( "loading events ..." );
  const events = readdirSync( "lib/events" );
  for( const eventName of events ) {
    if( !!eventName ) {
      const path = `../events/${eventName}`;
      if( !existsSync( `lib/events/${eventName}` ) ) {
        console.info( `Did not find lib/events/${eventName} skipping ...` );
      }
      else {
        if( !!require.cache[ require.resolve( path ) ] ) {
          delete require.cache[ require.resolve( path ) ];
        }
        console.debug( "setting event:", eventName );
        const event = require( path );
        if( !!bot.events[ event.default?.type ] ) {
          bot.events[ event.default.type ].set( event.default.name, event.default );
        }
        else {
          console.warn( "no such event type mapping for:", event.default?.type );
        }
      }
    }
  }

};

/**
 * @typedef {import('../struct/Bot').default} Bot
 */
