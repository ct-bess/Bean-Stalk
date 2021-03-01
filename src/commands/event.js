import { argHandler } from "../argHandler.js";

export default {
  name: "event",
  aliases: [ "rsvp" ],
  description: "event tool to organize the boyz. Bean will spam your group with this command",
  exec( message, bot ) {

    const args = argHandler( message );
    const subCommand = ( args.get( 0 ) + "" ).toLowerCase();
    let response = "";
    const eventName = args.get( "name" );
    const eventTime = args.get( "time" );
    //const eventExists = !!eventName && !!eventTime && !!bot.var.events?.eventTime?.eventName;
    let eventExists = false, isOrganizer = false;
    let event = null;

    // OK
    if( !!eventName && !!eventTime ) {
      if( !!bot.var.events[eventTime] ) {
        if( !!bot.var.events[eventTime][eventName] ) {
          eventExists = true;
          event = bot.var.events[eventTime][eventName];
          if( !!event.organizers && event.organizers.includes( message.author.id ) ) {
            isOrganizer = true;
          }
        }
      }
    }

    switch( (subCommand + (eventExists+0) + (isOrganizer+0)) ) {
      case "create11":
      case "create10":
        response = `event **${eventName}** already exists at ${eventTime}`;
        break;
      case "mod00":
      case "kick00":
      case "edit00":
      case "delete00":
        response = `Your not an organizer and `;
      case "mod01":
      case "kick01":
      case "edit01":
      case "join01":
      case "delete01":
      case "show01":
      case "leave01":
      case "join00":
      case "delete00":
      case "show00":
      case "leave00":
        response += `event **${eventName}** at ${eventTime} don't exists :triumph:`;
        break;
      case "create01":
      case "create00":

        let loc = "none specified";
        if( args.has( "location" ) ) {
          loc = args.get( "location" ) + "";
          if( loc.startsWith( "<#" && loc.endsWith( ">" ) ) ) {
            loc = loc.substring( 2, loc.length - 1 );
          }
        }
        const newEvent = {
          period: args.get( "period" ) || 8,
          location: loc,
          occurances: 0,
          description: args.get( "description" ) || args.get( 1 ) || "???",
          command: args.get( "command" ),
          roles: args.has( "roles" ) ? args.get( "roles" ).split( ' ' ) : [],
          attendees: args.has( "attendees" ) ? args.get( "attendees" ).split( ' ' ) : [],
          organizers: [ message.author.id ]
        };
        console.info( "Creating New event ...", newEvent );
        //Object.assign( bot.var.events, { eventTime } );
        //Object.assign( bot.var.events[eventTime], { eventName } );
        bot.var.events[eventTime] = {};
        bot.var.events[eventTime][eventName] = newEvent;
        response = `created **${eventName}** for ${eventTime}`;
        break;
      case "delete10":
      case "mod10":
      case "kick10":
      case "edit10":
        response = "Can't let you do that star fox";
        break;
      case "edit11":
        // lol
        event[ args.lastKey() ] = args.last();
        response = `Setting ${args.lastKey()} to ${args.last()}`;
        break;
      case "join11":
      case "join10":
        if( event.attendees.includes( message.author.id ) ) {
          response = `bruH your already in **${eventName}** :rage:`;
        }
        else {
          event.attendees.push( message.author.id );
          response = `You've joined **${eventName}** :sweat_drops:`;
          if( event.organizers.length === 0 ) {
            event.organizers.push( message.author.id );
            response += " you're also an organizer gl lol";
          }
        }
        break;
      case "delete11":
        if( args.has( "yes" ) && args.has( "please" ) && args.has( "sir" ) ) {
          delete bot.var.events[eventTime][eventName];
          response = `deleted **${eventName}** at ${eventTime} :flushed:`;
        }
        else { 
          response = "Ya sure ya know what'reya gettin eya self into???"; 
        }
        break;
      case "mod11":
        const nonAdmin = event.organizers.includes( message.author.id );
        if( !!nonAdmin ) {
          event.organizers.push( message.author.id );
          response = `Adminified modified organizerified <@!${message.author.id}>`;
        }
        else {
          response = `bruH your already mod in **${eventName}** at ${eventTime} what more do you want?? :triumph:`;
        }
        break;
      case "leave11":
      case "leave10":
        const literallyYou = event.attendees.includes( message.author.id );
        if( !!literallyYou ) {
          event.attendees.splice( event.attendees.indexOf( message.author.id ), 1 );
          response = `You left **${eventName}** ${eventTime} :sob:`;
        }
        else {
          response = `You're not even in **${eventName}** for ${eventTime}`;
        }
        break;
      case "kick11":
        const user = args.get( "attendee" ) || args.get( "who" ) || args.get( 1 );
        if( !!user ) {
          const isInEvent = event.attendees.includes( user );
          const isOrg = event.organizers.includes( user );

          if( isOrg ) event.organizers.splice( event.organizers.indexOf( user ), 1 );
          if( isInEvent ) {
            event.attendees.splice( event.attendees.indexOf( user ), 1 );
            response = `Kicked the supplied user from ${eventTime} ${eventTime} :cry:`;
          }
          else response = "Supplied user isn't an attendee";
        }
        else {
          response = "supply an attendee next time dude";
        }
        break;
      case "list00":
      case "list01":
      case "list10":
      case "list11":
        for( const time in bot.var.events ) {
          for( const name in bot.var.events[time] ) {
            response += `**${name}** - ${time}\n`;
          }
        }
        break;
      case "show10":
      case "show11":
        response = {
          color: 0xffea00,
          title: eventName,
          description: event.description || "no description",
          fields: [
            {
              name: "Time",
              value: eventTime
            },
            {
              name: "Location",
              value: `<#${event.location}>`
            },
            {
              name: "Period",
              value: "every " + event.period + " day(s)"
            },
            {
              name: "Occurances",
              value: event.occurances
            },
            {
              name: "The Chads",
              value: event.attendees.length == 0 ? "NO ONE :sob:" : ""
            }
          ],
          footer: {
            text: "Sponsored by Bean-Stalk",
            icon_url: bot.user.displayAvatarURL()
          }
        };

        for( const id of event.attendees ) {
          const mod = event.organizers.includes( id );

          if( args.has( "loud" ) || args.has( "l" ) ) {
            response.fields[4].value += `<@!${id}>`;
          }
          else {
            let name = bot.guilds.resolve( bot.var.guild ).members.resolve( id );
            name = !!name ? name.nickname || name.displayName : id;
            response.fields[4].value += name;
          }
          response.fields[4].value += mod ? " :star:\n" : "\n";
        }
        for( const id of event.roles ) {

          if( args.has( "loud" ) || args.has( "l" ) ) {
            response.fields[4].value += `<&!${id}>\n`;
          }
          else {
            let role = bot.guilds.resolve( bot.var.guild ).roles.resolve( id );
            role = !!role ? role.name : id;
            response.fields[4].value += `${role}\n`;
          }

        }

        break;
      default:
        response = `No such sub command **${subCommand}** :face_with_monocle:`;
        console.warn( "No such event.js subcommand switch for:", subCommand + (eventExists+0) + (isOrganizer+0) );
    }
    if( typeof( response ) === "object" ) message.channel.send( { embed: response } );
    else message.channel.send( !!response && response.length > 0 ? response : "this Bruh empty" );
  }
};
