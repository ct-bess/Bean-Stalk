export default {
  name: "event",
  aliases: [ "rsvp" ],
  description: "RSVP/event tool. Bean will spam your group with this command",
  exec( message, bot ) {

    message.reply("Under heavy construction; Disabled for now");
    return;

    const args = message.content.slice( 1 ).split( /\s+/ );
    args.shift();
    const subCommand = args[0].toLowerCase() || "lmao";
    let response = "";
    const eventName = args[1];
    const eventExists = bot.var.events.has( eventName );
    //const event = !!eventExists ? bot.var.events.get( eventName ) : false;
    const event = bot.var.events.get( eventName );
    switch( (subCommand + (eventExists+0)) ) {
      case "create1":
        response = `event ${args[1]} already exists`;
        break;
      case "join0":
      case "edit0":
      case "delete0":
      case "show0":
      case "mod0":
      case "kick0":
      case "leave0":
        response = `event ${eventName} don't exists :triumph:`;
        break;
      case "create0":
        const newEvent = {
          name: eventName + "",
          date: new Date( args[2] + "" ),
          description: "no description",
          where: args[3] || "",
          frequency: !!args[4] ? (args[4] + "").toLowerCase() : "one-off",
          participants: [{ name: message.author.username, id: message.author.id, admin: true }],
          times: 0,
          reminders: [], // 30min and 24hr reminders, but ideally what ever the user wants
          hasNotification: true
        };
        console.info( "New event:", newEvent );
        bot.var.events.set( newEvent.name, newEvent );
        response = !!event.date ? `Created **${newEvent.name}**` : `Invalid date: \`${args[2]}\`, update the event date to unbreakify it`;
        break;
      case "edit1":
        if( !!event[args[2]] && event.participants.find( elem => elem.id === message.author.id && elem.admin ) ) {
          response = `editing ${event[args[2]]} ...`;
          if( args[2] === "date" ) event[args[2]] = new Date( args[3] + "" );
          else if( args[2] === "description" ) { 
            event[args[2]] = args.slice(3).join(' ');
          }
          else event[args[2]] = args[3];
        }
        else {
          response = `Your not an organizer of **${eventName}**, or invalid event variable: **${args[2]}**`;
        }
        break;
      case "join1":
        if( !event.participants.find( elem => elem.id === message.author.id ) ) {
          const admin = event.participants.length == 0 ? true : false;
          event.participants.push( { name: message.author.username, id: message.author.id, admin: admin } );
          response = `You've joined **${eventName}** :sweat_drops:`;
        }
        else {
          response = `bruH your already in **${eventName}** :rage:`;
        }
        break;
      case "delete1":
        if( event.participants.find( elem => elem.id === message.author.id && elem.admin ) ) {
          //event.delete( eventName );
          bot.var.events.delete( eventName );
          response = `deleted ${eventName}`;
        }
        else { 
          response = "You aint an admin for this event :triumph:"; 
        }
        break;
      case "mod1":
        const nonAdmin = event.participants.find( elem => elem.id === message.author.id && !elem.admin );
        console.info( "nonAdmin:", nonAdmin );
        if( !!nonAdmin ) {
          event.participants[ event.participants.indexOf( nonAdmin ) ].admin = true;
          response = `Adminified <@!${message.author.id}>`;
        }
        else {
          response = `bruH your already mod or not in **${eventName}**`;
        }
        break;
      case "leave1":
        const literallyYou = event.participants.find( elem => elem.id === message.author.id );
        if( !!literallyYou ) {
          event.participants.splice( event.participants.indexOf( literallyYou ), 1 );
          response = `You left **${eventName}** :sob:`;
        }
        else {
          response = `You're not in **${eventName}**`;
        }
        break;
      case "kick1":
        const user = event.participants.find( elem => elem.name === args[2]+"" );
        if( !event.participants.find( elem => elem.id === message.author.id && !!elem.isAdmin ) ) {
          response = `You're not admin of **${eventName}** :triumph:`;
        }
        else if( !!user ) {
          event.participants.splice( event.participants.indexOf( user ), 1 );
          response = `Kicked ${args[2]}`;
        }
        else {
          response = `can' find username: ${args[2]}`;
        }
        break;
      case "list0":
      case "list1":
        bot.var.events.every( elem => response += `Name: **${elem.name}**\n` );
        break;
      case "show1":
        response = {
          color: 0xffea00,
          title: event.name || "lma0",
          description: event.description || "no description",
          fields: [
            {
              name: "Date",
              value: event.date.toLocaleString()
            },
            {
              name: "Location",
              value: event.where || "no where lma0"
            },
            {
              name: "Frequency",
              value: event.frequency || "one-off"
            },
            {
              name: "Occurances",
              value: event.times + ""
            },
            {
              name: "Participants",
              value: event.participants.length == 0 ? "NO ONE :sob:" : ""
            }
          ],
          footer: {
            text: event.hasNotification ? "Can notify" : "Event is over",
            icon_url: bot.user.displayAvatarURL()
          }
        };

        for( const i of event.participants ) {
          if( !!i.name ) response.fields[4].value += `${i.admin ? i.name + ":star:" : i.name}\n`
        }
        break;
      default:
        response = `No such sub command **${subCommand}** :face_with_monocle:`;
    }
    if( typeof( response ) === "object" ) message.channel.send( { embed: response } );
    else message.channel.send( !!response && response.length > 0 ? response : "this Bruh empty" );
  }
};
