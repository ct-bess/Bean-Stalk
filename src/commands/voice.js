import { argHandler } from "../argHandler.js";
import { sendBulk } from "../sendBulk.js";
import { execSync } from "child_process";
//import { Readable } from "stream";

export default {
  name: "voice",
  aliases: [ "vc" ],
  description: "connect bean to a voice channel to play music and sutff",
  audioStream: null,
  connection: null,
  resourceQueue: [],
  exec( message, bot ) {
    const args = argHandler( message );
    const subcommand = ( (args.get(0)+"") || "error").toLowerCase() + (!!this.connection + 0) + (!!this.audioStream + 0);

    // path to local file, url to file; readable streams will be a seperate thing
    let resource = ( args.get( "resource" ) || args.get( "r" ) || args.get( 1 ) ) + "";

    // I am very much temporary
    const bngpath = "/home/ctbess/.steam/steam/steamapps/music/BallisticNG - Soundtrack/";
    let bngfiles = null;

    // add the fs audio path for non url's
    if( !!resource ) {
      if( !( resource.startsWith( "http" ) || resource.startsWith( "www" ) ) ) {
        // for testing purposes; Will be generalized later. Also I purchased this glorious OST, I am no petty theif!
        // make sure this get's validated too
        resource = bngpath + resource + ".mp3";
      }
    }
    // assume the resource in question is the first in the queue; Also remember the 1st resource is what's currently playing
    // so calling play with no args appends the current song again
    else {
      resource = this.resourceQueue[0];
    }

    let response = "", voiceChannel = null;

    // make sure you validate that's a voice channel dog
    // another case of "man I really need to upgrade to ES2021 w/e for better nullish ops"
    if( args.has( "channel" ) ) {
      if( bot.channels.cache.has( args.get( "channel" ) ) ) {
        const channel = bot.channels.cache.resolve( args.get( "channel" ) );
        if( channel.type === "voice" ) {
          voiceChannel = channel;
        }
      }
    }

    // big todo: proper playlists, audiogen (from previous channel messages, dump text into a preformatted mp3 file), text-to-speach?
    // I also want to figure out how to pipe a regular old readable stream straight in there for this use case:
    // const s = exec( "echo 'main(t){for(;;t++){putchar(t*(42&t>>10));}}' | gcc -xc - && ./a.out | aplay" );
    // this.connection.play( s.stdout ) ??? but it would be nice if it only played thru bean

    switch( subcommand ) {
      case "play00":
      case "play01":
        if( !voiceChannel ) {
          voiceChannel = message.member.voice.channel ? message.member.voice.channel : bot.channels.cache.find( v => v.type === "voice" );
        }
        console.info( "Joining Voice Channel:", voiceChannel.id );

        // very much temporary
        if( args.has( "bng" ) ) {
          // wow amazing
          bngfiles = execSync( `ls '${bngpath}' | grep --color=never mp3` ).toString().split("\n");
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
          resource = this.resourceQueue.shift();
        }

        this.resourceQueue.push( resource );
        // if there are not voice channels in the cache this will break
        voiceChannel.join().then( connection => {
          this.connection = connection;
          this.audioStream = connection.play( resource );
          this.configureAudioStream();
          //bot.user.setActivity( resource, { type: "LISTENING" } );

          this.connection.on( "disconnect", () => { console.info( "VoiceConnection was disconnected" ) } );
          this.connection.on( "error", ( error ) => { console.error( "VoiceConnection error:", error ) } );
          this.connection.on( "failed", ( error ) => { console.error( "VoiceConnection failed:", error ) } );
          this.connection.on( "newSession", () => { console.info( "VoiceConnection started new session" ) } );
          this.connection.on( "ready", () => { console.info( "VoiceConnection is ready" ) } );
          this.connection.on( "reconnecting", () => { console.info( "VoiceConnection is reconnecting ..." ) } );
          this.connection.on( "warn", ( warning ) => { console.warn( warning ) } );

        });
        break;
      // no stream, but we're already connected; meaning the resource queue probly finished
      case "play10":
        this.audioStream = this.connection.play( resource );
        this.configureAudioStream();
        break;
      // has connection and stream; so we append to our queue and nothign else
      case "play11":
        this.resourceQueue.push( resource );
        break;
      case "next10":
      case "playnext10":
      case "next11":
      case "playnext11":
        //this.resourceQueue.shift();
        console.info( "Playing next resource:", this.resourceQueue[0] );
        //bot.user.setActivity( this.resourceQueue[0], { type: "LISTENING" } );
        this.audioStream = this.connection.play( this.resourceQueue.shift() );
        this.configureAudioStream();
        break;
      case "volume11":
      case "setvolume11":
        // set volume to --volume=number; else default to 1 (note: range = 0-2 --> 0% to 200%)
        let volume = args.get( "volume" ) || args.get( "v" ) || args.get( "vol" ) || args.get( 1 ) || 1;
        // no funny business, not a scam, pledge 2.1 bucks
        volume = Math.abs( parseFloat( volume ) || 1 ) % 2.1;
        response = `Setting volume to ${volume}`
        this.audioStream.setVolume( volume );
        break;
      case "bitrate11":
        let bitrate = args.get( "bitrate" ) || args.get( "b" ) || args.get( "bit" ) || args.get( 1 ) || 96;
        response = `Setting bitrate to ${bitrate}. succ? ` + this.audioStream.setBitrate( bitrate );
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
        console.info( "stopping audio stream and connection ..." );
        this.audioStream.pause();
        this.connection.disconnect();
        response = "aight bro cya";
        break;
      case "songs00":
      case "songs01":
      case "songs10":
      case "songs11":
        response = this.resourceQueue.join( "\n" );
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
        response = "WHAT'RE THOASEEE!!!";
        console.warn( "no really, what's", subcommand, "???" );
    }

    if( response.length > 2000 ) sendBulk( response, message, null );
    else if( response.length > 0 ) message.channel.send( response );

  }, // EO exec
  configureAudioStream() {

    // not sure if this is the way to do it; but when the current resource ends, the stream dispatcher ends and the events are scrapped
    // i.e. resource ends --> "speaking" event is called once --> stream set to new resource --> previous events are nuked
    // We could just play resources without saving the stream, but then we cant modify audio, bitrate, and maybe cant detect the end of resources
    // the VoiceConnection is seperate from a StreamDispatcher; their functionality is not the same
    // For now, I'll reset them for every resource, but that seems wrong
    // so this will be called everywhere we start a new song, oh boy

    this.audioStream.on( "error", ( error ) => { console.error( "StreamDispatcher encountered a fatal error:", error ) } );
    this.audioStream.on( "start", () => { console.info( "StreamDispatcher started" ) } );
    this.audioStream.on( "finish", () => { console.info( "StreamDispatcher finished" ) } );
    this.audioStream.on( "close", () => { console.info( "StreamDispatcher closed" ) } );
    //this.audioStream.on( "drain", () => { console.info( "StreamDispatcher drained" ) } );

    this.audioStream.on( "speaking", ( value ) => {
      // not speaking? assume song is over
      if( !value ) {
        console.info( "StreamDispatcher speaking state:", value ) 
        console.info( "Resource queue length:", this.resourceQueue.length ) 
        if( this.resourceQueue.length > 0 ) {
          // we have to shift twice for somereason here
          this.resourceQueue.shift();
          console.info( "Previous resource finished; StreamDispatcher starting next resource:", this.resourceQueue[0] ) 
          // include (bot) if you want this
          //bot.user.setActivity( this.resourceQueue[0], { type: "LISTENING" } );
          this.audioStream = this.connection.play( this.resourceQueue.shift() );
          // nice, this is officially recursive, forgive me hardware
          this.configureAudioStream();
        }
        else {
          console.info( "No more resources; Destroying StreamDispatcher and disconnecting" );
          this.audioStream.destroy();
          this.connection.disconnect();
        }
      }
    });

  } // EO configureAudioStream
};
