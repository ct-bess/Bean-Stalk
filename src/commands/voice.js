import { argHandler, sendBulk, coalesce } from "../commandUtil.js";
import { appendFile, existsSync, readdirSync, createReadStream } from "fs";
import { decoder, saveRecord } from "../audioUtil.js";

export default {
  name: "voice",
  aliases: [ "vc" ],
  description: "connect bean to a voice channel to play music and sutff",
  audioStream: null,
  connection: null,
  streamOptions: { volume: 0.5, bitrate: 96, type: "unknown" },
  readStreams: {},
  // consider changing this to an array of objects
  // { uri, name, type }
  resourceQueue: [],
  exec( message, bot ) {
    const args = argHandler( message );

    let subcommand = ( (args.get(0)+"") || "error").toLowerCase();// + (!!this.connection + 0) + (!!this.audioStream + 0);
    if( !!this.connection ) subcommand += (this.connection.status !== 4) + 0;
    else subcommand += !!(this.connection) + 0;
    if( !!this.audioStream ) subcommand += !(this.audioStream.destroyed) + 0;
    else subcommand += !!(this.audioStream) + 0;

    let response = "", voiceChannel = null;
    const clippath = "kb/voice-records";

    let resource = args.get( "resource" ) || args.get( "r" ) || args.get( 1 );
    let memberId = null;
    if( args.has( "user" ) ) {
      const member = coalesce( args.get( "user" ), "member", null, message.member.guild  );
      if( !!memberId ) memberId = memberId.author.id;
      else {
        response = "bruH can't find given user";
        console.warn( `couldnt find user: ${args.get( "user" )}` );
        subcommand = 1;
      }
    }
    else memberId = message.author.id;

    // I am very much temporary
    const bngpath = "/home/ctbess/.steam/steam/steamapps/music/BallisticNG - Soundtrack/";
    let bngfiles = null;

    // -- process & validate resource if any

    if( args.has( "recording" ) || args.has( "clip" ) ) {
      if( !!resource ) {
        resource = `${clippath}/${resource}`;
        if( !existsSync( resource ) ) {
          response = "aint got no resource";
          console.info( "cannot find resource:", resource );
          // wow brilliant
          subcommand = 1;
        }
      }
      else {
        const allRecordings = readdirSync( clippath );
        resource = allRecordings[ Math.floor( Math.random() * allRecordings.length ) ];
        resource = `${clippath}/${resource}`;
      }
    }
    else {
      resource = bngpath + resource + ".mp3";
    }

    // cool but what if we queued up an opus file? we'd need this as a callable function
    if( !!resource ) {
      const extension = ( resource.split( '.' )[1] || "unknown" ).toLowerCase();
      switch( extension ) {
        case "opus":
          // OK FUNNY this throws the same error I'm having with @discord/opus
          // but it's probly b/c this is just a buffer dump, there are not opus headers in this file
          // ACTUALLY NVM it still dies if I properly create an opus file with the proper headers
          // word on the street is you gotta make extra super sure it's a real opus file
          this.streamOptions.type = "opus";
          resource = createReadStream( resource );
          break;
        case "ogg":
          this.streamOptions.type = "ogg/opus";
          resource = createReadStream( resource );
          break;
        case "pcm":
          this.streamOptions.type = "converted";
          resource = createReadStream( resource );
          break;
        case "webm":
          this.streamOptions.type = "webm/opus";
          resource = createReadStream( resource );
          break;
        default:
          this.streamOptions.type = "unknown";
      }
      console.info( "Using stream type:", this.streamOptions.type, "for file extension:", extension );
    }

    // -- validate voice channel

    // make sure you validate that's a voice channel dog
    // another case of "man I really need to upgrade to ES2021 w/e for better nullish ops"
    if( args.has( "channel" ) ) {

      let channel = args.get( "channel" );
      channel = coalesce( channel, "channel", bot, null );

      if( !!channel ) {
        if( channel.type === "voice" ) {
          voiceChannel = channel;
        }
      }

    }

    if( !!this.connection ) {
      voiceChannel = this.connection.channel;
    }
    else if( !voiceChannel ) {
      voiceChannel = message.member.voice.channel ? message.member.voice.channel : bot.channels.cache.find( v => v.type === "voice" );
    }

    switch( subcommand ) {
      case "play00":
      case "play01":
        console.info( "Joining Voice Channel:", voiceChannel.id );

        // very much temporary
        if( args.has( "bng" ) ) {
          bngfiles = readdirSync( bngpath );
          if( args.has( "shuffle" ) ) {
            for( let i = 0; i < bngfiles.length; ++i ) {
              const swapper = bngfiles[i];
              const randoI = Math.floor( Math.random() * bngfiles.length );
              bngfiles[i] = bngfiles[randoI];
              bngfiles[randoI] = swapper;
            }
          }
          for( let i = 0; i < bngfiles.length; ++i ) bngfiles[i] = bngpath + bngfiles[i];
          this.resourceQueue = [ ...this.resourceQueue, ...bngfiles ];
          console.debug( "resourceQueue:", this.resourceQueue );
        }
        else this.resourceQueue.push( resource );

        voiceChannel.join().then( connection => {
          this.configureVoiceConnection( connection );
          this.audioStream = connection.play( this.resourceQueue[0], this.streamOptions );
          this.configureAudioStream();
        });
        break;
      // no stream, but we're already connected; meaning the resource queue probly finished
      case "play10":
        this.resourceQueue.push( resource );
        console.info( "playing resource:", this.resourceQueue[0] );
        this.audioStream = this.connection.play( this.resourceQueue[0], this.streamOptions );
        this.configureAudioStream();
        break;
      // has connection and stream; so we append to our queue and nothign else
      case "play11":
        console.info( "enqueueing resource:", resource );
        this.resourceQueue.push( resource );
        break;
      case "next10":
      case "playnext10":
      case "next11":
      case "playnext11":
        this.resourceQueue.shift();
        console.info( "Playing next resource:", this.resourceQueue[0] );
        if( this.resourceQueue.length > 0 ) {
          this.audioStream = this.connection.play( this.resourceQueue[0], this.streamOptions );
          this.configureAudioStream();
        }
        break;
      case "volume11":
      case "setvolume11":
        // set volume to --volume=number; else default to 1 (note: range = 0-2 --> 0% to 200%)
        let volume = args.get( "volume" ) || args.get( "v" ) || args.get( "vol" ) || args.get( 1 ) || 1;
        // no funny business, not a scam, pledge 2.1 bucks
        volume = Math.abs( parseFloat( volume ) || 1 ) % 2.1;
        response = `Setting volume to ${volume}`
        this.audioStream.setVolume( volume );
        this.streamOptions.volume = volume;
        break;
      case "bitrate11":
        let bitrate = args.get( "bitrate" ) || args.get( "b" ) || args.get( "bit" ) || args.get( 1 ) || 96;
        response = `Setting bitrate to ${bitrate}. succ? ` + this.audioStream.setBitrate( bitrate );
        this.streamOptions.bitrate = bitrate;
        break;
      case "pause11":
        console.info( "pausing audio stream" );
        this.audioStream.pause();
        break;
      case "resume11":
        console.info( "resuming audio stream" );
        this.audioStream.resume();
        break;
      case "stop11":
      case "leave11":
        this.audioStream.pause();
      case "stop10":
      case "leave10":
        console.info( "stopping audio stream and connection ..." );
        this.connection.disconnect();
        break;
      case "listen11":
      case "listen10":
        if( args.has( "pool" ) || args.has( "p" ) ) this.createReadStream( memberId, "pool", 1 );
        else this.createReadStream( memberId, "record", 1 );
        break;
      case "listen01":
      case "listen00":
        voiceChannel.join().then( connection => {
          this.configureVoiceConnection( connection );
          if( args.has( "pool" ) || args.has( "p" ) ) this.createReadStream( memberId, "pool", 1 );
          else this.createReadStream( memberId, "record", 1 );
        });
        break;
      case "echo11":
      case "echo10":
        this.createReadStream( memberId, null, 1 );
        this.connection.play( this.readStreams[memberId], { type: "opus" } );
        break;
      case "echo01":
      case "echo00":
        voiceChannel.join().then( connection => {
          this.configureVoiceConnection( connection );
          this.createReadStream( memberId, null, 1 );
          connection.play( this.readStreams[memberId], { type: "opus" } );
        });
        break;
      case "clip00":
      case "clip01":
      case "clip10":
      case "clip11":
        // we might want to pause the VoiceReciever if there's an active one here
        console.info( "Clipping recording for id:", memberId );
        //decoder( memberId, message, null );
        saveRecord( memberId, message );
        break;
      case "clips00":
      case "clips01":
      case "clips10":
      case "clips11":
        response = readdirSync( clippath ).join( "\n" );
        break;
      case "songs00":
      case "songs01":
      case "songs10":
      case "songs11":
        response = this.resourceQueue.join( "\n" );
        break;
      case "listeners00":
      case "listeners01":
      case "listeners10":
      case "listeners11":
        response = "Current listeners: ";
        for( const key in this.readStreams ) {
          if( !this.readStreams[key].destroyed ) {
            let name = bot.guilds.resolve( bot.var.guild ).members.resolve( key );
            name = !!name ? name.nickname || name.displayName : key;
            response += name + "\n";
            console.info( name, key );
          }
        }
        break;
      case "destroy00":
      case "destroy01":
      case "destroy10":
      case "destroy11":
        if( !!this.readStreams[memberId] ) {
          console.info( "Destroying VoiceReciever:", memberId );
          this.readStreams[memberId].destroy();
          message.react( "\u0030\u20E3" );
        }
        else {
          console.info( "Cannot find VoiceReciever:", memberId );
          message.react( "\u0031\u20E3" );
        }
        break;
      case "next00":
      case "playnext00":
      case "volume00":
      case "setvolume00":
      case "volume10":
      case "setvolume10":
      case "setbitrate00":
      case "setbitrate10":
      case "pause00":
      case "pause10":
      case "resume00":
      case "resume10":
        response = "no stream lol";
        break;
      case "next01":
      case "playnext01":
      case "volume01":
      case "setvolume01":
      case "setbitrate01":
      case "pause01":
      case "resume01":
        response = "no connection lol, but why tf we still have a stream?";
        break;
      default:
        console.warn( "no such subcommand:", subcommand );
        message.react( "\u0031\u20E3" );
    }

    if( response.length > 2000 ) sendBulk( response, message, null );
    else if( response.length > 0 ) message.channel.send( response );

  }, // EO exec
  createReadStream( memberId, type, duration ) {
    const minutes = Math.floor( duration * 60 * 1000 );
    const mode = "opus";
    console.info( "Creating VoiceReciever read stream for:", memberId );
    this.readStreams[memberId] = this.connection.receiver.createStream( memberId, { mode: mode, end: "manual" } );

    if( type === "record" ) {
      this.readStreams[memberId].on( "data", ( chunk ) => {
        // chunk.length = number of bytes in buffer
        appendFile( `kb/voice-receiver/${memberId}.${mode}`, chunk, ( error ) => {
          if( error ) {
            console.error( `Error appending to ${memberId}`, error );
            this.readStreams[memberId].destroy();
          }
        });
      });
    }
    else if( type === "pool" ) {
      const timestamp = ( new Date() ).toLocaleString().replace( /[/, :]/g, "" );
      this.readStreams[memberId].on( "data", ( chunk ) => {
        appendFile( `kb/voice-receiver/pool-${timestamp}.${mode}`, chunk, ( error ) => {
          if( error ) {
            console.error( `Error appending to ${memberId}`, error );
            this.readStreams[memberId].destroy();
          }
        });
      });
    }
    // Opus codec is actually OP, I think we can just kill the stream when the person disconnects from audio
    // the alternative is to save an Interval and check to see if it's time to end it
    // Or we can do something within appendFile
    /*
    setTimeout( () => {
      console.info( "Destroying VoiceReciever for:", memberId );
      this.readStreams[memberId].destroy();
    }, minutes )
    */
  },
  configureVoiceConnection( connection ) {
    this.connection = connection;
    this.connection.on( "disconnect", () => { console.info( "VoiceConnection was disconnected" ) } );
    this.connection.on( "error", ( error ) => { console.error( "VoiceConnection error:", error ) } );
    this.connection.on( "failed", ( error ) => { console.error( "VoiceConnection failed:", error ) } );
    this.connection.on( "newSession", () => { console.info( "VoiceConnection started new session" ) } );
    this.connection.on( "ready", () => { console.info( "VoiceConnection is ready" ) } );
    this.connection.on( "reconnecting", () => { console.info( "VoiceConnection is reconnecting ..." ) } );
    this.connection.on( "warn", ( warning ) => { console.warn( warning ) } );
  }, // EO configureVoiceConnection
  configureAudioStream() {

    this.audioStream.on( "error", ( error ) => { console.error( "StreamDispatcher encountered a fatal error:", error ) } );
    this.audioStream.on( "start", () => { console.info( "StreamDispatcher started" ) } );
    this.audioStream.on( "finish", () => { console.info( "StreamDispatcher finished" ) } );
    this.audioStream.on( "close", () => { console.info( "StreamDispatcher closed" ) } );
    //this.audioStream.on( "drain", () => { console.info( "StreamDispatcher drained" ) } );

    this.audioStream.on( "speaking", ( value ) => {
      // not speaking? assume song is over
      if( !value ) {

        this.resourceQueue.shift();
        if( this.resourceQueue.length > 0 ) {
          console.info( "StreamDispatcher is speaking?:", value == true ) 
          console.info( "Resource queue length:", this.resourceQueue.length ) 
          console.info( "Previous resource finished; StreamDispatcher starting next resource:", this.resourceQueue[0] ) 
          // include (bot) if you want this
          //bot.user.setActivity( this.resourceQueue[0], { type: "LISTENING" } );
          this.audioStream = this.connection.play( this.resourceQueue[0], this.streamOptions );
          this.configureAudioStream();
        }
        else {
          //console.info( "No more resources; Destroying StreamDispatcher and disconnecting" );
          //this.audioStream.destroy();
          //this.connection.disconnect();
          // hope this Okaaay
          //this.audioStream = null;
          //this.connection = null;
        }
      }
    });

  } // EO configureAudioStream
};
