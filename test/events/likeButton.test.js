import { Intents, Collection } from "discord.js";
import Bot from "../../src/struct/Bot";
import LikeButton from "../../src/events/likeButton.js";

describe( "src/events/likeButton.js", () => {

  const bot = new Bot({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILDS
    ]
  });
  bot.user = {
    setActivity: () => {}
  };

  const mockChannel = {
    send: () => {}
  };

  const mockInteraction = {
    update: () => {},
    component: []
  };

  it( "can force trigger the mf like button", () => {
    expect( LikeButton.canTrigger( true ) ).toBe( true );
  });

  it( "Creates the mf like button", () => {
    LikeButton.likebutton( bot, mockChannel );
    mockInteraction.component = LikeButton.button;
    expect( LikeButton.button.length ).toBe( 1 );
  });

  it( "Smashes the mf like button", () => {
    LikeButton.handleInteraction( mockInteraction );
    expect( LikeButton.likeCount ).toBe( 1 );
  });

});
