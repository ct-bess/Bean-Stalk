import { argHandler, coalesce } from "../commandUtil.js";

export default {
  name: "event",
  aliases: [ "rsvp" ],
  description: "an over-engineered event scheduler tool",
  exec( message, bot ) {

    const args = argHandler( message );
    const subCommand = ( args.get( 0 ) + "" ).toLowerCase();
    let response = "";
    let eventTime = args.get( "time" );
    let eventName = args.get( "name" );
    if( args.has( 1 ) && (!!eventTime || !!eventName) ) {
      const exprSplit = args.get( 1 ).split( /\s+/, 2 );
      eventTime = exprSplit[0];
      eventName = exprSplit[1];
    }
    //const eventExists = !!eventName && !!eventTime && !!bot.var.events?.eventTime?.eventName;
    let eventExists = false, isOrganizer = false;
    let event = null;

    // OK thats it im upgrading to ES2021 for better nullish opperations
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
          loc = args.get( "location" );
          const channel = coalesce( loc, "channel", bot, null );
          if( !!channel ) loc = channel.id;
        }
        let roles = [];
        if( args.has( "roles" ) ) {
          let roleArg = args.get( "roles" ).split( " " );
          for( const role of roleArg ) {
            const roleObj = coalesce( role, "role", null, message.member.guild );
            if( !!roleObj ) roles.push( roleObj.id );
          }
        }
        let attendees = [];
        if( args.has( "attendees" ) ) {
          let attendeeArg = args.get( "attendees" ).split( " " );
          for( const attendee of attendeeArg ) {
            const userObj = coalesce( attendee, "member", null, message.member.guild );
            if( !!userObj ) attendees.push( userObj.id );
          }
        }

        const newEvent = {
          period: args.get( "period" ) || 8,
          location: loc,
          raw: args.has( "raw" ) || args.has( "r" ),
          silent: args.has( "silent" ) || args.has( "s" ),
          occurances: 0,
          description: args.get( "description" ) || ":sweat_drops:",
          command: args.get( "command" ),
          roles: roles,
          attendees: attendees,
          organizers: [ message.author.id ]
        };
        console.info( "Creating New event ...", newEvent );
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
        // THIS IS HORRIBLE
        let editKey = "", editVal = "", source = null;
        if( args.has( "newname" ) ) {
          editVal = args.get( "newname" );
          editKey = "name";
          source = Object.assign( {}, bot.var.events[eventTime][eventName] );
          delete bot.var.events[eventTime][eventName]
          bot.var.events[eventTime][editVal] = source;
        }
        else if( args.has( "newtime" ) ) {
          editVal = args.get( "newtime" );
          editKey = "time";
          source = Object.assign( {}, bot.var.events[eventTime] );
          editKey += ` (affecting ${Object.keys(source).length} event(s))`;
          delete bot.var.events[eventTime]
          bot.var.events[editVal] = source;
        }
        else {
          // so that we can flip -raw
          editKey = args.lastKey();
          editVal = typeof( args.last() ) === "boolean" ? !event[editKey] : args.last();
          bot.var.events[eventTime][eventName][editKey] = editVal;
        }
        response = `Setting ${editKey} to ${editVal}`;
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
        const user = coalesce( args.get( "attendee" ) || args.get( 1 ), "member", null, message.member.guild );
        if( !!user ) {
          const isInEvent = event.attendees.includes( user.id );
          const isOrg = event.organizers.includes( user.id );

          if( isOrg ) event.organizers.splice( event.organizers.indexOf( user.id ), 1 );
          if( isInEvent ) {
            event.attendees.splice( event.attendees.indexOf( user.id ), 1 );
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
