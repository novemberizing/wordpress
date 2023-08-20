import { ApplicationServerServiceModule } from "@novemberizing/app";
import Storage from "@novemberizing/storage";

import WordpressExceptionUninitialized from "../exception/Uninitialized.js";

const extension = {
    get: {
        sql: "CALL PROCEDURE_WORDPRESS_POST_GET(?)"
    }
};

export default class WordpressPost extends ApplicationServerServiceModule {
    #storage = null;

    constructor(service, config) {
        super("/post", service, config);

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

    async get(id) {
        return await this.#storage.query("get", id); 
    }

    async off() {
        this.#storage.close();
    }
}
