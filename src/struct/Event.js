/**
 * types:
 * - date/time based, ie. do thing at x time
 * - message based, ie. meets a regex
 * - voice based, ie. someone joins vc
 * - random, ie. do thing unexpectibly
 */
class Event {

  constructor( event ) {
    this.name = ( "" + event.name ).toLowerCase();
    this.type = ( "" + event.type ).toLowerCase();
    this.canTrigger ||= () => {};
    this.handleInteraction ||= () => {};
    for( const f in this ) {
      if( this[f] instanceof Function ) {
        this[f] = this[f].bind( this );
      }
    }
  }

  /**
   * @param {Bot} bot
   * @returns {Response}
   */
  exec = ( bot, trigger ) => {
    const shouldTrigger = !!trigger ? !!this.canTrigger( trigger ) : !!this.canTrigger();
    if( shouldTrigger ) {
      console.debug( "executing event:", this.name );
      this[this.name].call( this, bot );
    }
  }

}

export default Event;
