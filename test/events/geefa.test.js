import { Intents, Collection } from "discord.js";
import Bot from "../../src/struct/Bot";
import Geefa from "../../src/events/geefa.js";
import { EventEmitter } from "events";

describe( "src/events/geefa.js", () => {

  const bot = new Bot({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS
    ]
  });

  const mockChannel = {
    isText: () => { return true },
    createMessageCollector: () => { return new EventEmitter() },
    send: () => {},
    guild: {
      emojis: {
        cache: ( new Collection() ).set( "blunt123", { name: "blunt123" } )
      }
    }
  };

  const mockMessage = {
    react: () => {}
  };

  bot.guilds.cache.set( bot.homeGuildId, {
    channels: {
      cache: ( new Collection() ).set( bot.homeGuildId, mockChannel )
    }
  });

  it( "geefa can trigger at 4:20am & 4:20pm", () => {
    expect( Geefa.canTrigger( new Date( "1/1/1 4:20" ) ) ).toBe( true );
    expect( Geefa.canTrigger( new Date( "1/1/1 16:20" ) ) ).toBe( true );
  });

  it( "geefa defaults to current date", () => {
    const result = Geefa.canTrigger();
    expect( typeof( result ) === "boolean" ).toBe( true );
  });

  it( "geefa event reacts and posts messages", () => {
    Geefa.geefa( bot );
    const collectSpy = jest.spyOn( Geefa.collector._events, "collect" );
    const endSpy = jest.spyOn( Geefa.collector._events, "end" );
    Geefa.collector.emit( "collect", mockMessage );
    Geefa.collector.emit( "end", { size: 1 } );
    expect( collectSpy ).toHaveBeenCalled();
    expect( endSpy ).toHaveBeenCalled();
  });

});
