/** @param { Discord.Message } message **/
export const sendBulk = ( response, message, format ) => {
  console.info( "[ INFO ] sendBulk() response length: " + response.length );
  let textBound = 2000;
  let prefix = "", suffix = "";
  switch( format ) {
    case "italics":
      textBound = 1998;
      prefix = "*", suffix = prefix;
      break;
    case "bold":
      textBound = 1996;
      prefix = "**", suffix = prefix;
      break;
    case "inline code":
      textBound = 1998;
      prefix = "`", suffix = prefix;
      break;
    case "quote":
      textBound = 1998;
      prefix = "> ";
      break;
    case "quote block":
      textBound = 1996;
      prefix = ">>> ";
      break;
    case "code block":
      textBound = 1992;
      prefix = "```\n", suffix = "\n```";
      break;
    default:
      textBound = 2000;
      prefix = "", suffix = "";
  }
  if( response.length < textBound ) {
    console.warn( "[ WARN ] sendBulk called on string < 2000" );
  }
  for( let i = 0; i < response.length; i += textBound ) {
    const chunk = response.substring( i, i + textBound );
    //message.channel.send( prefix + chunk + suffix );
    setTimeout( () => {message.channel.send( prefix + chunk + suffix )}, 300 );
  }
};
