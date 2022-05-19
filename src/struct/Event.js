/**
 * data and time based
 * random based, ie. do something weird periodically (technically also time based)
 * regex based, ie. someone says something in a text channel, we might respond with a dad joke
 * voice based, ie. someone joins a voice channel, maybe bean joins the vc and then periodically plays random stuff
 */
class Event {

  constructor( event ) {
    this.name = event.name;
    // on "messageCreate", "voiceConnectionCreate", "eventInterval" (from Bot class)
    this.trigger = event.trigger;
    this.data = event.data;
    this.exec = this.exec.bind( this );
  }

  // do we need to specify an exec? yeah probably.but what should be the base exec?

  /**
   * @param {Bot} bot
   * @returns {Response}
   */
  exec = ( bot ) => {

  }

}

export default Event;
