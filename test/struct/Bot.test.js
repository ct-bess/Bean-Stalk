import { Intents } from "discord.js";
import Bot from "../../src/struct/Bot";
import { loadCommands } from "../../src/util/systemUtil";

describe( "src/struct/Bot.js", () => {

  const bot = new Bot({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS
    ]
  });

  it( "commands load", () => {
    loadCommands( bot );
    expect( bot.commands.size > 0 ).toBe( true );
  });

  it( "event interval is called", () => {

    // this is silly
    bot.eventInterval._idleTimeout = 100;
    //console.log( bot.eventInterval );
    bot.eventInterval.refresh();
    expect( bot ).toBeTruthy();

    const spy = jest.spyOn( bot.eventInterval, "_onTimeout" );

    return( new Promise( r => setTimeout( r, 500 ) ).then( () => {
      expect( spy ).toHaveBeenCalled();
    }) );

  });

});
