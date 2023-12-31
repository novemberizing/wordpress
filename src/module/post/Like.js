import { ApplicationServerServiceModule } from "@novemberizing/app";
import Storage from "@novemberizing/storage";

const extension = {
    toggle: {
        sql: "CALL PROCEDURE_WORDPRESS_POST_LIKE_TOGGLE(?, ?)"
    },
    get: {
        sql: "CALL PROCEDURE_WORDPRESS_POST_LIKE_GET(?, ?)"
    }
};

export default class WordpressPostLike extends ApplicationServerServiceModule {
    #storage = null;

    constructor(service, config) {
        super("/post/like", service, config);

        if(config.storage) {
            this.#storage = new Storage(Object.assign({extension}, config.storage));
        } else if(service.config.storage) {
            this.#storage = new Storage(Object.assign({extension}, service.config.storage));
        } else if(service.server.config.storage) {
            this.#storage = new Storage(Object.assign({extension}, service.server.config.storage));
        } else {
            throw new WordpressExceptionUninitialized();
        }
    }

    async toggle(id, email) {
        return await this.#storage.query("toggle", id, email);
    }

    /**
     * 
     * @param {*} id 
     * @param {*} email 
     * @returns 
     */
    async get(id, email) {
        id = Array.isArray(id) ? id : [ id ];

        return await this.#storage.query("get", JSON.stringify(id), email);
    }

    async off() {
        this.#storage.close();
    }
}