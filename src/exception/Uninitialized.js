import WordpressException from "../WordpressException.js";

export default class WordpressExceptionUninitialized extends WordpressException {
    constructor(message, original) {
        super(message, original);
    }
}
