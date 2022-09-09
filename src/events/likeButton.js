import Event from '../struct/Event';
import Constants from '../util/constants';
import { MessageActionRow, MessageButton } from "discord.js";

/**
 * the mf like button
 */
class LikeButton extends Event {

  constructor() {
    super({ name: "likebutton", type: "random" });
    this.cooldown = {
      onCooldown: false,
      timeout: null
    };
    this.button = [];
    this.likeCount = 0;
  }

  /**
   * @param {boolean} [force] - to force event to trigger
   */
  canTrigger = ( force = false ) => {

    if( this.cooldown.onCooldown === false || force === true ) {

      const roll = Math.floor( Math.random() * 100 );

      if( roll === 69 || force === true ) {
        this.cooldown.onCooldown = true;
        this.cooldown.timeout = setTimeout( () => {
          this.cooldown.onCooldown = false;
          this.button = [];
        }, Constants.time.ONE_HOUR );
        this.cooldown.timeout.unref();
        return( true );
      }

    }

    return( false );

  }

  /**
   * could also save the interaction and then disable the button when the cooldown is finished
   * @param {ButtonInteraction} interaction
   */
  handleInteraction = ( interaction ) => {
    this.likeCount += 1;
    const updatedComponent = interaction.component;
    updatedComponent.label = "LIKE x" + this.likeCount;
    const roll = Math.floor( Math.random() * 11 );
    if( roll === 10 ) {
      updatedComponent.disabled = true;
    }
    interaction.update({ components: [updatedComponent] });
  }

  /**
   * @param {Bot} bot
   * @param {TextChannel} [channel]
   */
  likebutton = ( bot, channel ) => {

    if( !channel ) {
      channel = bot.guilds.cache.random().channels.cache.find( c => { return c.isText() });
    }

    const component = new MessageButton({
      label: "LIKE",
      style: Constants.styles.SUCCESS,
      disabled: false,
      customId: `${this.name}-handleInteraction`
    });
    this.button = [ component ];

    const actionRow = new MessageActionRow().addComponents( this.button );

    channel.send({ components: actionRow });
    bot.user.setActivity( "SMASH LIKE", { type: "WATCHING" } );

  }

}

export default new LikeButton();

/**
 * @typedef {import('discord.js').ButtonInteraction} ButtonInteraction
 * @typedef {import('discord.js').CommandInteraction} CommandInteraction
 * @typedef {import('discord.js').TextChannel} TextChannel
 * @typedef {import('../struct/Bot').default} Bot
 */