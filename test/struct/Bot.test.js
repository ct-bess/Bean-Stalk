import { Intents } from "discord.js";
import Bot from "../../src/struct/Bot";
import Event from "../../src/struct/Event";
import { loadCommands, loadEvents } from "../../src/util/systemUtil";

describe( "src/struct/Bot.js", () => {

  const bot = new Bot({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS
    ]
  });

  class TestEvent extends Event {
    constructor() {
      super({ name: "test", type: "datetime" });
    }
    canTrigger = () => {
      return( true );
    }
    test = () => {
      console.log( "test event was called" );
    }
  }

  /**
   * Dependent on the build in lib/
   */
  it( "commands load", () => {
    loadCommands( bot );
    expect( bot.commands.size > 0 ).toBe( true );
  });

  /**
   * Dependent on the build in lib/
   */
  it( "datetime events load", () => {
    loadEvents( bot );
    expect( bot.events.datetime.size > 0 ).toBe( true );
  });

  it( "event interval is called", () => {

    // this is silly
    bot.eventInterval._idleTimeout = 100;
    bot.eventInterval.refresh();
    const intervalSpy = jest.spyOn( bot.eventInterval, "_onTimeout" );
    const event = new TestEvent();
    bot.events.datetime.set( event.name, event );
    const eventSpy = jest.spyOn( bot.events.datetime.get( event.name ), "test" );

    return( new Promise( r => setTimeout( r, 500 ) ).then( () => {
      expect( intervalSpy ).toHaveBeenCalled();
      expect( eventSpy ).toHaveBeenCalled();
    }) );

  });

});
