import { createReadStream, appendFile, readdirSync, existsSync, unlink, rename } from "fs";
import { OpusEncoder } from "@discordjs/opus";

// https://discordjs.guide/voice/understanding-voice.html#understanding-voice
export const decoder = ( fileName, message, ar ) => {

  const sourceDir = "kb/voice-receiver";
  const destDir = "kb/voice-records";

  const IFS = `./${sourceDir}/${fileName}.opus`;
  const OFSpcm = `./${sourceDir}/${fileName}.pcm`;
  if( !existsSync( IFS ) ) {
    console.error( "Cannot find file:", IFS );
    message.react( "\u0031\u20E3" );
    return;
  }

  const encoder = new OpusEncoder( ar || 48000, 2 );

  console.info( "starting opus to pcm conversion ..." );
  console.info( IFS, "-->", OFSpcm );
  const readStream = createReadStream( IFS );
  console.debug( "created read stream" );

  readStream.on( "error", ( error ) => {
    console.error( "readStream error:", error );
  });

  readStream.on( "data", chunk => {
    // this causes a core dump, why?
    const decoded = encoder.decode( chunk );
    appendFile( OFSpcm, decoded, ( error ) => {
      if( error ) console.error( "appendFile error:", error );
    });
  });

  readStream.on( "close", () => {
    console.info( "starting pcm to mp3 conversion ..." );

    if( existsSync( OFSpcm ) ) {

      const timestamp = ( new Date() ).toLocaleString().replace( /[/, :]/g, "" );
      const fileNumber = "" + readdirSync( destDir ).length + 1;
      const OFmp3 = `${destDir}/${fileNumber}-${fileName}.mp3`;
      const OFarch = `${sourceDir}/archive/${timestamp}-${fileName}.opus`;
      console.info( OFSpcm, "-->", OFmp3 );

      const cliargs = [ 
        "-f", "s16le", 
        "-ar", ar || "48k",
        "-ac", "2", 
        "-i", OFSpcm,
        OFmp3
      ];
      let proc = spawn( "ffmpeg", cliargs );
      proc.on( "close", ( code ) => {
        console.info( "saved? exit code:", code );
        if( code === 0 ) {
          message.react( "\u0030\u20E3" );
          console.info( "deleting pcm file ..." );
          unlink( OFSpcm, error => {
            if( error ) console.error( "delete error:", error );
          });
          console.info( "archiving opus file ..." );
          rename( IFS, OFarch, error => {
            if( error ) console.error( "rename error:", error );
          });
        }
        else {
          console.error( "ffmpeg process failed" );
          message.react( "\u0031\u20E3" );
        }
      });

    }
    else {
      console.error( `No such file: ${OFSpcm} to convert` );
      message.react( "\u0031\u20E3" );
    }
  });

}; // EO decoder
