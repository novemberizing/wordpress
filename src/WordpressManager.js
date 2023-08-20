import { ApplicationServerService } from "@novemberizing/app";
import Application from "@novemberizing/app";

import axios from "axios";
import { XMLSerializer, DOMParser } from "@xmldom/xmldom";

import WordpressPost from "./module/Post.js";
import WordpressMedia from "./module/Media.js";


export default class WordpressManager extends ApplicationServerService {
    static {
        Application.use(WordpressPost);
        Application.use(WordpressMedia);
    }

    static #parser = new DOMParser();
    static #serializer = new XMLSerializer();


    static #dom(element) {
        if(element.removeAttribute) {
            element.removeAttribute("class");
        }

        if(element.childNodes && element.childNodes.length > 0) {
            for(let i = 0; i < element.childNodes.length; i++) {
                WordpressManager.#dom(element.childNodes[i]);
            }
        }

        return element;
    }
    static #str(root) {
        let str = '';
        const body = root.getElementsByTagName("body")[0];
        for(let i = 0; i < body.childNodes.length; i++) {
            str += WordpressManager.#serializer.serializeToString(body.childNodes[i]);
        }
        return str;
    }

    

    #host = null;

    constructor(server, config) {
        super("/wordpress", server, config);

        this.#host = config.host;

        console.log(config);

        if(server.express) {
            server.express.get(`${this.path}/post`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.post()),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });
        }
    }

    async post(id) {
        /** TODO: 최신 포스트만 가지고 오도록 한다. */
        const response = await axios.get(`${this.#host}/wp/v2/posts`);
        const posts = response.data.map(WordpressPost.hide);

        const post = posts[0];

        const media = WordpressMedia.hide(post.featured_media ? await axios.get(`${this.#host}/wp/v2/media/${post.featured_media}`) : null);

        const extension = await this.moduleCall("/post", "get", post.id);

        return Object.assign(post, { extension }, { media });
    }
}