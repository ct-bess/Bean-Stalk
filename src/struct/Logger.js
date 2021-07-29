import { Console } from "console";
import { createWriteStream } from "fs";

/**
 * Ya'll wana learn how to override the default global console to also log to a file and possibly miss other console features??
 * > subclassing Console didn't work, so here we are
 * 
 * Uses traditional level heirarchy:
 * - TRACE: 5
 * - DEBUG: 4
 * - INFO: 3
 * - WARN: 2
 * - ERROR: 1
 * - OFF: 0
 * @implements {Console}
 * @property {number} level - log level in use
 * @example
 * // Create and use
 * const logger = new Logger( "mylogs.log", "INFO" );
 * logger.info( "this will log" );
 * logger.error( "this will log too" );
 * logger.debug( "but this won't log since the level is set to INFO" );
 * let level = logger.setLevel( "DEBUG" );
 * logger.debug( "now this will log since we're in:", level );
 * @example
 * // Override global nodejs console
 * console = new Logger( "logs.log", "TRACE" );
 * console.log( "this", "still", "works" );
 * console.debug( "everything :tm:", "is working as usual!" );
 */
class Logger {

  /**
   * @param {string} logFile - full path to log file
   * @param {(string|number)} [logLevel=3] - the log level to set; Defaults to "INFO"
   */
  constructor( logFile, logLevel = 3 ) {

    if( !logFile || typeof( logFile ) !== "string" ) {
      throw new Error( "log file argument supplied to Logger was null/undefined or not a string" );
    }

    /**
     * An object of log levels available
     * @readonly
     * @name levels
     * @memberof Logger
     * @type {Object}
     */
    this.levels = Object.freeze({
      OFF: 0,
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      DEBUG: 4,
      TRACE: 5
    });

    /** 
     * The logger's write steam
     * @memberof Logger 
     * @type {WriteStream}
     */
    this.logStream = createWriteStream( logFile );

    /** 
     * A Console that joins stdout and stderr into the logStream
     * @private
     * @memberof Logger 
     * @type {Console}
     */
    this.console = new Console({
      stdout: this.logStream,
      stderr: this.logStream
    });

    /** 
     * A Console with the default Node.js configuration; stdout and stderr are sent to the shell/console
     * that started the app
     * @private
     * @memberof Logger 
     * @type {Console}
     */
    this.shell = new Console({
      stdout: process.stdout,
      stderr: process.stderr
    });

    this.logStream.on( "close", () => {
      this.shell.info( "Log stream closed" );
    });
    this.logStream.on( "error", ( error ) => {
      this.shell.error( "Log stream encountered a fatal error" );
      this.shell.error( error.name + ":", error.message );
    });

    /**
     * Level in use; Must exist in [levels]{@link Logger.levels}
     * @name level
     * @memberof Logger
     * @type {number}
     */
    this.level = null;
    this.setLevel( logLevel );

    // Ok but why do the other not need to be bound???
    this.error = this.error.bind( this );

  }

  /**
   * set the log level ya, if it's invalid it doesn't get set
   * @method setLevel
   * @memberof Logger
   * @param {(string|number)} level - the log level to set to; Must exist in [levels]{@link Logger.levels} as a key or value
   * @returns {?string} the log level set; null on error
   */
  setLevel = ( level ) => {

    level = ( level + "" ).toUpperCase();
    console.debug( "attempting to set log level to:", level );

    for( const key in this.levels ) {
      if( key == level || this.levels[key] == level ) {
        this.level = this.levels[key];
        console.info( "log level set to:", key );
        return( key );
      }
    }

    console.warn( "cannot set log level to:", level );
    return( null );

  }

  /**
   * Gets the current log [level]{@link Logger.level} in readable format
   * @method getLevel
   * @memberof Logger
   * @returns {?string} the current log [level]{@link Logger.level}; null on invalid level set
   */
  getLevel = () => {

    for( const key in this.levels ) {
      if( this.level === this.levels[key] ) {
        console.info( "Current log level is:", key );
        return( key );
      }
    }

    console.error( "Log level is currently set to unknown value:", this.level );
    return( null );
  }


  /**
   * Creates a timestamp for log entry. Year and timezone are omitted.
   * Uses 24hr cycle
   * @private
   * @method getTimeStamp
   * @memberof Logger
   * @returns {string} locale date time string in format: `Month DD HH:MM:SS`
   */
  getTimeStamp = () => {
    return( ( new Date() ).toLocaleString( "en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h24"
      }
    ));
  }

  /**
   * log stdout to shell, nothing is written to log stream.
   * Log happens regardless of what [level]{@link Logger.level} is set
   * @method log
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  log = function() {
    this.shell.log( ...arguments );
  }

  /**
   * log stderr to shell and log stream
   * when log [level]{@link Logger.level} is set to ERROR or higher
   * @method error
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  error = function() {
    if( this.level >= this.levels.ERROR  ) {
      const timestamp = this.getTimeStamp();
      this.console.error( timestamp, "[ERROR]", ...arguments );
      this.shell.error( ...arguments );
    }
  }

  /**
   * log stderr to shell and log stream
   * when log [level]{@link Logger.level} is set to WARN or higher
   * @method warn
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  warn = function() {
    if( this.level >= this.levels.WARN  ) {
      const timestamp = this.getTimeStamp();
      this.console.warn( timestamp, "[WARN]", ...arguments );
      this.shell.warn( ...arguments );
    }
  }

  /**
   * log stdout to shell and log stream
   * when log [level]{@link Logger.level} is set to INFO or higher
   * @method info
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  info = function() {
    if( this.level >= this.levels.INFO  ) {
      const timestamp = this.getTimeStamp();
      this.console.info( timestamp, "[INFO]", ...arguments );
      this.shell.info( ...arguments );
    }
  }

  /**
   * log stdout to shell and log stream
   * when log [level]{@link Logger.level} is set to DEBUG or higher
   * @method debug
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  debug = function() {
    if( this.level >= this.levels.DEBUG  ) {
      const timestamp = this.getTimeStamp();
      this.console.debug( timestamp, "[DEBUG]", ...arguments );
      this.shell.debug( ...arguments );
    }
  }
  
  /**
   * log stack trace to shell and log stream
   * when log [level]{@link Logger.level} is set to TRACE or higher
   * @method trace
   * @memberof Logger
   * @param {...any} - any number of args
   * @returns {void}
   */
  trace = function() {
    if( this.level >= this.levels.TRACE  ) {
      const timestamp = this.getTimeStamp();
      this.console.trace( timestamp + " [TRACE]", ...arguments );
      this.shell.trace( ...arguments );
    }
  }

  /**
   * Literally justs passes to Console.assert but adds an assert tag to logs and shell
   * @method assert
   * @memberof Logger
   * @param {any} value - the variable to check truthyness for
   * @param {...any} - message to display on assertion failure
   * @returns {void}
   */
  assert = function( value ) {
    const timestamp = this.getTimeStamp();
    this.console.assert( value, timestamp, "[ASSERTION]", ...arguments );
    this.shell.assert( value, timestamp, "[ASSERTION]", ...arguments );
  }

  /**
   * Clears the shell
   * @method clear
   * @memberof Logger
   * @returns {void}
   */
  clear = () => {
    this.shell.clear();
  }

};

export default Logger;
