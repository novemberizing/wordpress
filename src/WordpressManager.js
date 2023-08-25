import { ApplicationServerService } from "@novemberizing/app";
import Application from "@novemberizing/app";

import axios from "axios";

import WordpressPost from "./module/Post.js";
import WordpressPostLike from "./module/post/Like.js";
import WordpressMedia from "./module/Media.js";

export default class WordpressManager extends ApplicationServerService {
    static {
        Application.use(WordpressPost);
        Application.use(WordpressPostLike);
        Application.use(WordpressMedia);
    }

    #host = null;

    constructor(server, config) {
        super("/wordpress", server, config);

        this.#host = config.host;

        if(server.express) {
            server.express.get(`${this.path}/post/`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.posts(req.query.page, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });
            server.express.get(`${this.path}/post/:id`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.post(req.params.id, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });

            server.express.get(`${this.path}/post/:id/like`, async (req, res) => {
                console.log("wordpress", req.user);
                await WordpressManager.call(async () => res.send(await this.like(req.params.id, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });
        }
    }

    async posts(page, user) {
        let posts = await this.moduleCall("/post", "posts", page || 1, user && user.email);

        if(Array.isArray(posts)) {
            for(let i = 0; i < posts.length; i++) {
                posts[i] = Object.assign(posts[i], { media: await this.moduleCall("/media", "get", posts[i].featured_media) });
                posts[i] = Object.assign(posts[i], await this.moduleCall("/post/like", "get", posts[i].id, user && user.email));
                delete posts[i].featured_media;
            }
        }

        return posts;
    }

    async post(id, user) {
        let post = await this.moduleCall("/post", "get", id, user && user.email);
        console.log(user);

        if(post) {
            post = Object.assign(post, { media: await this.moduleCall("/media", "get", post.featured_media) });
            post = Object.assign(post, await this.moduleCall("/post/like", "get", post.id, user && user.email));

            delete post.featured_media;
        }

        return post;
    }

    async like(id, user) {
        return await this.moduleCall("/post/like", "toggle", id, user && user.email);
    }
}