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
    /** base interaction */
    REPLY: "reply",
    /** message component interactions (button & select menu) */
    UPDATE: "update",
    /** auto complete interaction */
    RESPOND: "respond"
  });
}

export default Constants;
