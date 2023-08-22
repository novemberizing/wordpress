import { ApplicationServerServiceModule } from "@novemberizing/app";
import Storage from "@novemberizing/storage";

import { XMLSerializer, DOMParser } from "@xmldom/xmldom";

import WordpressExceptionUninitialized from "../exception/Uninitialized.js";

import novemberizing from "../novemberizing.js";

const extension = {
    get: {
        sql: "CALL PROCEDURE_WORDPRESS_POST_GET(?, ?)"
    }
};

export default class WordpressPost extends ApplicationServerServiceModule {

    static #parser = new DOMParser();
    static #serializer = new XMLSerializer();

    static #dom(element) {
        if(element.removeAttribute) {
            element.removeAttribute("class");
        }

        if(element.childNodes && element.childNodes.length > 0) {
            for(let i = 0; i < element.childNodes.length; i++) {
                WordpressPost.#dom(element.childNodes[i]);
            }
        }

        return element;
    }
    static #str(root) {
        let str = '';
        const body = root.getElementsByTagName("body")[0];
        for(let i = 0; i < body.childNodes.length; i++) {
            str += WordpressPost.#serializer.serializeToString(body.childNodes[i]).replace(/ xmlns="[^"]+"/, '');
        }
        return str;
    }

    static #hide(post) {
        delete post.guid;
        delete post.status;
        delete post.post;
        delete post.link;
        post.title = post.title.rendered;
        post.content = WordpressPost.#str(WordpressPost.#dom(WordpressPost.#parser.parseFromString(`<body>${post.content.rendered}</body>`, "text/html")));
        delete post.author;
        delete post.comment_status;
        delete post.ping_status;
        delete post.sticky;
        delete post.template;
        delete post.categories;
        delete post.tags;
        delete post._links;
        delete post.type;
        post.excerpt = novemberizing.dom.text(novemberizing.dom.get(WordpressPost.#parser.parseFromString(post.excerpt.rendered, "text/html"), "p"));
        delete post.format;
        delete post.slug;

        return post;
    }

    #storage = null;
    #host = null;

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

        if(config.host) {
            this.#host = config.host;
        } else if(service.config.host) {
            this.#host = service.config.host;
        }
    }

    async get(id, email) {
        const post = WordpressPost.#hide(id ? await novemberizing.http.get(`${this.#host}/wp/v2/posts/${id}`) : novemberizing.array.front(await novemberizing.http.get(`${this.#host}/wp/v2/posts&offset=0`)));

        const extension = await this.#storage.query("get", id ? id : post.id, email);

        return Object.assign(post, { extension });
    }

    async off() {
        this.#storage.close();
    }
}
