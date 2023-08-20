import Log from "@novemberizing/log";

export default class WordpressException extends Error {
    static #tag = "WordpressException";

    #original = null;

    get original(){ return this.#original; }

    constructor(message, original = undefined) {
        super(message);

        this.#original = original;

        if(this.#original) {
            Log.w(WordpressException.#tag, original);
        }
    }
}