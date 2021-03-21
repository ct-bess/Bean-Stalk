import { createReadStream, appendFile, readdirSync, existsSync, unlink, rename, copyFile } from "fs";
import { OpusEncoder } from "@discordjs/opus";
import stream from "stream";


const sourceDir = "kb/voice-receiver";
const destDir = "kb/voice-records";

// https://discordjs.guide/voice/understanding-voice.html#understanding-voice
export const decoder = ( fileName, message, ar ) => {

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
    // even playing an encoded opus file with the proper headers from the stream dispatcher core dumps too
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

export const saveRecord = ( fileName, message ) => {

  const IF = `./${sourceDir}/${fileName}.opus`;
  if( !existsSync( IF ) ) {
    console.error( "File not found. Cannot save find file:", IF );
    message.react( "\u0031\u20E3" );
    return;
  }

  const fileNumber = "" + readdirSync( destDir ).length + 1;
  const OF = `./${destDir}/${fileNumber}-${fileName}.opus`;
  console.info( "Copying file:", IF, "-->", OF );

  copyFile( IF, OF, ( error ) => {
    if( error ) {
      console.error( error );
      message.react( "\u0031\u20E3" );
    }
    else {
      console.info( "Successfully copied file" );
      message.react( "\u0030\u20E3" );
    }
  });

}; // EO saveRecord

export const pipeRS = ( dest ) => {
  const s = new stream.Readable();

  for( let i = 0; i < 100; ++i ) {
    const r = Math.floor( Math.random() * i ) + 1;
    const d = [ 0x1 + i, 0x2 + i, 0x3 * i, 0x4 + 1, 0x5 + i, 0x6 + i ];
    s.push( Buffer.from(d) );
  }

  s.pipe( dest );
  s.destroy();
};
