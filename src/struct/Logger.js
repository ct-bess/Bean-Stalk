import { Console } from "console";
import { createWriteStream } from "fs";

/**
 * @class Logger
 * @description Ya'll wana learn how to override the default global console to also log to a file and possibly miss other console features??
 * @constructor logFile, logLevel
 * @property { Object } levels the available log levels
 * @property { integer } level the log level in use
 * @property { console.Console } console the console that writes the logs to a file
 * @property { console.Console } shell the console that writes logs to stdout and stderr in your shell
 * @method getLevel returns the current log level in a readable format
 * @method setLevel sets the log level; argument must exist as a key or value in levels property
 * @method log log anything to the shell; Only the shell btw
 * @method error log stderr to logs and shell
 * @method warn log stderr to logs and shell
 * @method info log stdout to logs and shell
 * @method debug log stdout to logs and shell
 * @method trace log stack trace to logs and shell
 * **/
class Logger {

  constructor( logFile, logLevel ) {

    this.levels = Object.freeze({
      OFF: 0,
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      DEBUG: 4,
      TRACE: 5
    });

    this.level = this.levels[logLevel] || logLevel || this.levels.INFO;
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
    return( `Unknown level: ${level}` );

  }

  getLevel = () => {

    for( const key in this.levels ) {
      if( this.level === this.levels[key] ) {
        return( key );
      }
    }

    console.error( "Log level is currently set to unknown value:", this.level );
    return( `Unknown level: ${this.level}` );
  }

  log = function() {
    this.shell.log( ...arguments );
  }

  error = function() {
    if( this.level >= this.levels.ERROR  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.error( timestamp, "[ERROR]", ...arguments );
      this.shell.error( ...arguments );
    }
  }

  warn = function() {
    if( this.level >= this.levels.WARN  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.warn( timestamp, "[WARN]", ...arguments );
      this.shell.warn( ...arguments );
    }
  }

  info = function() {
    if( this.level >= this.levels.INFO  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.info( timestamp, "[INFO]", ...arguments );
      this.shell.info( ...arguments );
    }
  }

  debug = function() {
    if( this.level >= this.levels.DEBUG  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.debug( timestamp, "[DEBUG]", ...arguments );
      this.shell.debug( ...arguments );
    }
  }
  
  trace = function() {
    if( this.level >= this.levels.TRACE  ) {
      const timestamp = ( new Date() ).toLocaleString();
      this.console.trace( timestamp + " [TRACE]", ...arguments );
      this.shell.trace( ...arguments );
    }
  }

};

export default Logger;
