/**
 * various constants for bean to reduce errors from my inability to spell
 */
class Constants {

  static interactionMethods = Object.freeze({
    /** base interaction */
    DEFER_REPLY: "deferReply", 
    /** base interaction */
    DELETE_REPLY: "deleteReply",
    /** base interaction */
    EDIT_REPLY: "editReply",
    /** base interaction */
    FETCH_REPLY: "fetchReply",
    /** base interaction */
    FOLLOW_UP: "followUp",
    /** base interaction (use this 90% of the time) */
    REPLY: "reply",
    /** message component interactions (button & select menu) */
    UPDATE: "update",
    /** auto complete interaction */
    RESPOND: "respond"
  });

  static emoji = Object.freeze({

    B: ":b:",

    FLUSHED: ":flushed:",
    TRIUMPH: ":triumph:",
    RAGE: ":rage:",
    CRY: ":cry:",
    SOB: ":sob:",

    ZERO: ":zero:",
    ONE: ":one:",
    TWO: ":two:",
    THREE: ":three:",
    FOUR: ":four:",
    FIVE: ":five:",
    SIX: ":six:",
    SEVEN: ":seven:",
    EIGHT: ":eight:",
    NINE: ":nine:",

    WHITE_CIRCLE: ":white_circle:",
    RED_CIRCLE: ":red_circle:",
    BLUE_CIRCLE: ":blue_circle:",
    GREEN_CIRCLE: ":green_circle:",
    ORANGE_CIRCLE: ":orange_circle:",

    SMALL_RED_TRIANGLE_DOWN: ":small_red_triangle_down:"
  });

  static styles = Object.freeze({
    PRIMARY: "PRIMARY"
  });

  static limits = Object.freeze({
    MESSAGE_CONTENT: 2000,
    SELECT_MENU_OPTIONS: 25,
    ACTION_ROW_COMPONENTS: 5
  });

}

export default Constants;
