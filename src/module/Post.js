import { ApplicationServerServiceModule } from "@novemberizing/app";
import Storage from "@novemberizing/storage";

import WordpressExceptionUninitialized from "../exception/Uninitialized.js";

const extension = {
    get: {
        sql: "CALL PROCEDURE_WORDPRESS_POST_GET(?)"
    }
};

export default class WordpressPost extends ApplicationServerServiceModule {
    static hide(post) {
        delete post.guid;
        delete post.status;
        delete post.post;
        delete post.link;
        post.title = post.title.rendered;
        post.content = WordpressManager.#str(WordpressManager.#dom(WordpressManager.#parser.parseFromString(`<body>${post.content.rendered}</body>`, "text/html")));
        delete post.author;
        delete post.comment_status;
        delete post.ping_status;
        delete post.sticky;
        delete post.template;
        delete post.categories;
        delete post.tags;
        delete post._links;
        delete post.type;
        delete post.excerpt;
        delete post.format;

        return post;
    }

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
