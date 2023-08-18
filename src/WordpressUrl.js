
export default class WordpressUrl {
    static #host = "https://content.bubus.co.kr";
    static #path = "?rest_route=";

    static set config(config) {
        WordpressUrl.#host = config.host;
        WordpressUrl.#path = config.path;
    }

    static get host(){ return WordpressUrl.#host; }
    static get path(){ return WordpressUrl.#path; }

    static gen(path) {
        return `${WordpressUrl.#host}/${WordpressUrl.#path}${path}`;
    }
}