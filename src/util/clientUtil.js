import help from "../../help.json";

/**
 * @method execCommand
 * @description process and execute a bot command from a text channel. Prefix validation does not happen here, only command validation
 * @param { Discord.Message | string } message the message that called this function. If called with a string, sets the bot's last message as the origin
 * @param { Discord.Client } bot the discord client processing the command
 * @returns { void }
 **/
export const execCommand = ( message, bot ) => {

  let commandArgs = null, command = null;

  try {

    if( typeof( message ) !== "object" ) {
      const content = message;
      message = bot.user.lastMessage;
      message.content = content;
    }

    message.content = message.content.slice( bot.var.config.prefix.length );
    commandArgs = message.content.toLowerCase().split( /\s+/, 2 );
    command = bot.commands.get( commandArgs[0] ) || bot.commands.find( cmd => cmd.aliases && cmd.aliases.includes( commandArgs[0] ) );

    console.debug( "[ execCommand ] -", "User:", message.author.username, "Command:", commandArgs[0] );

    if( !command ) {
      message.reply( "bruHh" );
      console.info( "Unknown command" );
    }
    else {

      const allowedBots = bot.var.bots.includes( message.author.id );

      //if( /^(?:-{1,2})?help$/.test( commandArgs[1] ) ) {
      if( commandArgs[1] === "help" ) {
        const helpEmbed = help[command.name] || {};
        helpEmbed.color = 0xffea00;
        helpEmbed.title = command.name + "";
        helpEmbed.description = command.description + "";
        helpEmbed.footer = { text: "aliases: " + command.aliases.join(', ') };
        message.channel.send({ embed: helpEmbed });
      }
      // wait a fat second to execute messages from allowed bots so we don't send a billion requests
      else if( allowedBots ) {
        setTimeout( () => {
          command.exec( message, bot );
        }, bot.var.config.botReplyDelay );
      }
      else {
        command.exec( message, bot );
      }

    }

  }
  catch( error ) {
    console.error( error );
    message.reply( bot.var.emojis.lmao + " **WHO DID THIS?!?!**\n```diff\n" + error + "\n```" );
    bot.user.setStatus( "dnd" );
    // crazy idea, what if we randomly DMed the error to a random guild member?
  }

};

/**
 * @method handleEvent
 * @description processes time based client events for scheduled commands
 * @param { Discord.Client } bot the client to handle the event
 * @returns { void }
 **/
export const handleEvent = ( bot ) => {
  try {
    const events = bot.var.events;
    const date = new Date();
    const currTime = date.getHours() + ":" + date.getMinutes();

    // Dailys and Weeklys
    if( !!events[currTime] ) {

      const currEvents = events[currTime]
      console.debug( "Found events for:", currTime );

      for( const key in currEvents ) {

        console.debug( "processing:", key );
        const eventObject = currEvents[key];

        if( !!eventObject.period ) {

          const period = parseInt( eventObject.period ) || 0;
          const validTrigger = ( date.getDay() + 1 ) % ( period ) === 0 ? true : false;
          console.debug( "Status:", period, validTrigger );

          if( validTrigger ) {
            // haha better hope these fields exist
            let attendees = "";
            for( const attendee of eventObject.attendees ) {
              attendees += `<@!${attendee}> `;
            }
            for( const role of eventObject.roles ) {
              attendees += `<&!${role}> `;
            }
            const response = !!eventObject.raw ? eventObject.description : {
              color: 0xffea00,
              title: key,
              description: eventObject.description,
              fields: [
                {
                  name: "Time",
                  value: currTime
                },
                {
                  name: "Location",
                  value: `<#${eventObject.location}>`
                },
                {
                  name: "Period",
                  value: "Every " + eventObject.period + " day(s)"
                },
                {
                  name: "Occurances",
                  value: eventObject.occurances
                },
                {
                  name: "The Chads",
                  value: attendees || "none :triumph:"
                }
              ],
              footer: {
                text: "Sponsored by Bean-Stalk",
                icon_url: bot.user.displayAvatarURL()
              }
            };

            let alertChannel = null;

            if( bot.channels.cache.has( eventObject.location ) ) {
              alertChannel = bot.channels.resolve( eventObject.location );
              if( !alertChannel.isText() ) {
                alertChannel = bot.channels.resolve( bot.var.channels.commands );
                response.footer.text = "Yo this location ain't a text channel; So I'm droppin it here yo";
              }
            }
            else {
              alertChannel = bot.channels.resolve( bot.var.channels.commands );
              response.footer.text = "Yo this location ain't even real; So I'm droppin it here yo";
            }

            if( !eventObject.silent ) {

              alertChannel.send( typeof( response ) === "object" ? { embed: response } : response ).then( message => {
                if( !!eventObject.command ) {
                  message.content = eventObject.command;
                  if( !message.content.startsWith( bot.var.config.prefix ) ) message.content = bot.var.config.prefix + message.content;
                  console.info( "executing event command:", eventObject.command, "with content:", message.content );
                  execCommand( message, bot );
                }
              });

            }
            else { // is silent
              if( !!eventObject.command ) {
                let message = alertChannel.lastMessage;
                message.content = eventObject.command;
                if( !message.content.startsWith( bot.var.config.prefix ) ) message.content = bot.var.config.prefix + message.content;
                console.info( "executing event command:", eventObject.command, "with content:", message.content );
                execCommand( message, bot );
              }
            }

            ++eventObject.occurances;

          } // EO event trigger

        } // EO valid event

      } // EO curr event loop

    } // EO event check

    // could run a check on date.toLocaleDateString() for hyper specific events

  }
  catch( error ) {
    console.error( error );
  }
};
