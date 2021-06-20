import { Console } from "console";
import { createWriteStream } from "fs";

/**
 * Ya'll wana learn how to override the default global console to also log to a file and possibly miss other console features??
 * 
 * Uses traditional level heirarchy:
 * - TRACE: 5
 * - DEBUG: 4
 * - INFO: 3
 * - WARN: 2
 * - ERROR: 1
 * - OFF: 0
 * @property {object} levels - the available log levels. Readonly btw
 * @property {number} level - the log level in use
 * @property {Console} console - the console that writes the logs to a file
 * @property {Console} shell - the console that writes logs to stdout and stderr in your shell
 * @method getLevel - returns the current log level in a readable format
 * @method setLevel - sets the log level; argument must exist as a key or value in levels property
 * @method log - log anything to the shell; Only the shell btw
 * @method error - log stderr to logs and shell
 * @method warn - log stderr to logs and shell
 * @method info - log stdout to logs and shell
 * @method debug - log stdout to logs and shell
 * @method trace - log stack trace to logs and shell
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
   * @param {string} [logLevel=3] - the log level to set; Defaults to "INFO"
   */
  constructor( logFile, logLevel ) {

    /** @readonly */
    this.levels = Object.freeze({
      OFF: 0,
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      DEBUG: 4,
      TRACE: 5
    });

    /** @type {number} */
    this.level = this.levels[logLevel] || this.levels.INFO;
    this.logStream = createWriteStream( logFile );

    this.console = new Console({
      stdout: this.logStream,
      stderr: this.logStream
    });

    // fun fact, this config is literally the default global console
    // too bad we can't *just* subclass it
    this.shell = new Console({
      stdout: process.stdout,
      stderr: process.stderr
    });

    // Ok but why do the other not need to be bound???
    this.error = this.error.bind( this );

  }

  /**
   * set the log level ya
   * @param {(string|number)} level - the log level to set to; Must exist in {@link Logger.levels} as a key or value
   * @returns {?string} the log level set; null on error
   */
  setLevel = ( level ) => {

    level = ( level + "" ).toUpperCase();
    this.console.debug( "attempting to set log level to:", level );

    for( const key in this.levels ) {
      if( key == level || this.levels[key] == level ) {
        this.level = this.levels[key];
        console.info( "log level set to:", key );
        return( key );
      }
    }

    this.console.warn( "cannot set log level to:", level );
    return( null );

  }

  /**
   * get the log level ya
   * @returns {?string} the current log level; null of invalid level set
   */
  getLevel = () => {

    for( const key in this.levels ) {
      if( this.level === this.levels[key] ) {
        this.console.info( "Current log level is:", key );
        return( key );
      }
    }

    this.console.error( "Log level is currently set to unknown value:", this.level );
    return( null );
  }

  /**
   * log stdout to shell, nothing is written to log stream.
   * Log happens regardless of what level is set
   * @param {...any} - any number of args
   * @returns {void}
   */
  log = function() {
    this.shell.log( ...arguments );
  }

  /**
   * log stderr to shell and log stream
   * when log level is set to ERROR or higher
   * @see {@link Logger.level}
   * @param {...any}
   * @returns {void}
   */
  error = function() {
    if( this.level >= this.levels.ERROR  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.error( timestamp, "[ERROR]", ...arguments );
      this.shell.error( ...arguments );
    }
  }

  /**
   * log stderr to shell and log stream
   * when log level is set to WARN or higher
   * @see {@link Logger.level}
   * @param {...any}
   * @returns {void}
   */
  warn = function() {
    if( this.level >= this.levels.WARN  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.warn( timestamp, "[WARN]", ...arguments );
      this.shell.warn( ...arguments );
    }
  }

  /**
   * log stdout to shell and log stream
   * when log level is set to INFO or higher
   * @see {@link Logger.level}
   * @param {...any}
   * @returns {void}
   */
  info = function() {
    if( this.level >= this.levels.INFO  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.info( timestamp, "[INFO]", ...arguments );
      this.shell.info( ...arguments );
    }
  }

  /**
   * log stdout to shell and log stream
   * when log level is set to DEBUG or higher
   * @see {@link Logger.level}
   * @param {...any}
   * @returns {void}
   */
  debug = function() {
    if( this.level >= this.levels.DEBUG  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.debug( timestamp, "[DEBUG]", ...arguments );
      this.shell.debug( ...arguments );
    }
  }
  
  /**
   * log stack trace to shell and log stream
   * when log level is set to TRACE or higher
   * @see {@link Logger.level}
   * @param {...any}
   * @returns {void}
   */
  trace = function() {
    if( this.level >= this.levels.TRACE  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.trace( timestamp + " [TRACE]", ...arguments );
      this.shell.trace( ...arguments );
    }
  }

};

export default Logger;
