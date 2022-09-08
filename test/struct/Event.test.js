import Event from "../../src/struct/Event";

describe( "src/struct/Event.js", () => {

  class TestEvent extends Event {
    constructor() {
      super({ name: "test", type: "datetime" });
    }
    canTrigger = ( trigger ) => {
      return( !!trigger );
    }
    test = () => {
      return( this.type );
    }
  }

  const event = new TestEvent();

  it( "the event checks to see if it can trigger and then calls exec", () => {
    const triggerSpy = jest.spyOn( event, "canTrigger" );
    const testSpy = jest.spyOn( event, "test" );
    event.exec( null, true );
    expect( triggerSpy ).toHaveBeenCalled();
    expect( testSpy ).toHaveBeenCalled();
  });

});
