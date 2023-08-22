import WordpressException from "../WordpressException.js";

export default class WordpressExceptionSupported extends WordpressException {
    constructor(message, original) {
        super(message, original);
    }
}
