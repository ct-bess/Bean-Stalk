import { Collection } from "discord.js";
import { argHandler, coalesce } from "../util/commandUtil";
import { numberToEmoji } from "../util/textUtil";

export default {
  name: "amongus",
  aliases: [ "amogus" ],
  description: "Play the hit game *amongus* but completly text based and at a very slow pace",
  game: {
    // ideally a tick should happen every hour-ish of daylight
    // no one except terminus should be inputing an action at 3am
    tickRate: 60*1000,
    ticks: 0,
    players: new Collection(),
    map: null,
    // save a ref to the interval so we can clear it later
    interval: null
  },
  exec( message, bot ) {

    // trust me

    if( !bot.var.admins.includes( message.author.id ) ) {
      message.reply( "not yet" );
      return;
    }

    const args = argHandler( message );

    let response = {
      embed: {
      }
    };
    const players = this.game.players;
    const player = players.get( message.author.id );
    const playerExists = players.has( message.author.id );
    const subcommand = args.get( 0 ) + ( playerExists + 0 );

    // 0 --> not in game, 1 --> yup they exist
    switch( subcommand ) {
      case "test0":
      case "test1":
        this.initWires( player );
        response = this.displayWires( player );
        break;
      case "wires0":
        console.info( message.author.username, "is not in amogus game" );
        break;
      case "new0":
      case "new1":
        break;
      case "join1":
        response = "bro you're already in the game";
        console.info( "player is already in amogus game:", message.author.username );
        break;
      case "join0":
        players.set( message.author.id, {
          name: message.author.username,
          color: null,
          tasks: {
            wires: []
          }
        });
        console.debug( "new user joined amogus:", message.author.username );
        response = "awesome";
        break;
      case "wires1":
        response = this.solveWires( player, args.get( 1 ) ) + "";
        break;
      case "morewires1":
        this.initWires( player );
        break;
      case "interact1":
      case "interact0":
        break;
      case "reset0":
      case "reset1":
        this.game.players = new Collection();
        break;
      default:
        message.react( "\u0031\u20E3" );
        return;
    }

    if( response.length > 0 ) message.send( response );
    else message.react( "\u0030\u20E3" );

  },
  // get game status, return to players
  // ie. what room they're in, what they can interact with, if they died last tick, etc
  getStatus() {
  },
  // interact with the specified object
  // ie. if task then play out task routine, if button then press button, if imposter interacting with crew then kill crew member, etc
  interact() {
  },
  solveWires( player, solution ) {
    // they'll be able to run something like [amongus wires red+1, blue+3, green+2 ... to specify the connections
    // emoji reacts don't seem like a good idea for this task given the input complexity
   console.debug( "solving for task:", player.tasks.wires[0] );
   // next up, make it so you can solve out of order i.e. blue+1 red+2 === red+2 blue+1
   const outcome = solution == player.tasks.wires[0]?.solution;
   console.debug( "solution outcome:", outcome );

   // also if true, call display to trace a crude path

    return( outcome );

  },
  displayWires( player ) {

    const inputWires = player.tasks.wires[0]?.input;
    const outputWires = player.tasks.wires[0]?.output;
    let response = "";

    for( let i = 0; i < inputWires.length; ++i ) {
      const numberEmoji = numberToEmoji( i+1 );
      const idisplay = `:${inputWires[i]?.color}_square:`;
      const odisplay = `:${outputWires[i]?.color}_square:`;
      response += `${idisplay}:white_small_square::white_small_square::white_small_square::white_small_square:${odisplay}${numberEmoji}\n`;
    }

    return( response );

  },
  initWires( player ) {

    const inputWires = [ 
      { row: 1, color: "red" },
      { row: 2, color: "blue" },
      { row: 3, color: "green" },
      { row: 4, color: "yellow" },
      { row: 5, color: "orange" }
    ];
    const outputWires = [ ...inputWires ];
    let solution = "";

    for( let i = 0; i < inputWires.length; ++i ) {
      const osel = Math.floor( Math.random() * inputWires.length );
      const isel = Math.floor( Math.random() * inputWires.length );
      [ inputWires[i], inputWires[isel] ] = [ inputWires[isel], inputWires[i] ];
      [ outputWires[i], outputWires[osel] ] = [ outputWires[osel], outputWires[i] ];
    }

    // make sure we track the rows w.r.t output
    for( let i = 1; i < outputWires.length + 1; ++i ) {
      outputWires[i-1].row = i;
    }

    // build solution
    for( let i = 1; i < inputWires.length + 1; ++i ) {
      const iwire = inputWires[i-1];
      owire: for( const owire of outputWires ) {
        if( owire.color === iwire.color ) {
          solution += `${iwire.color}+${owire.row} `;
          break owire;
        }
      }
    }

    // trim trailing whitespace
    solution = solution.substring( 0, solution.length - 1 );

    console.debug( "input wires:", inputWires );
    console.debug( "output wires:", outputWires );
    console.debug( "solution:", solution );

    player.tasks.wires.push({
      input: inputWires,
      output: outputWires,
      solution
    });

    console.debug( "added a wire task to:", player.name );

  }
};
