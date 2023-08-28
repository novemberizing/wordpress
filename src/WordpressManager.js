import { ApplicationServerService } from "@novemberizing/app";
import Application from "@novemberizing/app";

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
            server.express.get(`${this.path}/post`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postGet(null, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });



            server.express.get(`${this.path}/post/:id`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postGet(req.params.id, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });

            server.express.get(`${this.path}/posts`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postsGet(req.query.identities, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });

            server.express.get(`${this.path}/posts/like`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postsLikeGet(req.query.identities.split(','), req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });

            server.express.get(`${this.path}/posts/:page`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postsPageGet(req.params.page, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });



            server.express.post(`${this.path}/post/:id/like`, async (req, res) => {
                await WordpressManager.call(async () => res.send(await this.postLike(req.params.id, req.user)),
                                                  e  => res.status(500).send(WordpressManager.error(e)));
            });
        }
    }

    async postsPageGet(page, user) {
        const posts = await this.moduleCall("/post", "list", page || 1, user && user.email);
        const medias = await this.moduleCall("/media", "multiple", posts.map(post => post.featured_media));

        return posts.map((post, i) => {
            delete post.featured_media;
            return Object.assign(post, { media: medias[i] });
        });
    }

    async postsGet(identities, user) {
        const posts = await this.moduleCall("/post", "multiple", identities, user && user.email);
        const medias = await this.moduleCall("/media", "multiple", posts.map(post => post.featured_media));

        return posts.map(post => {
            post = Object.assign(post, { media: medias.find(o => o.id === post.featured_media) });
            delete post.featured_media;
            return post;
        });
    }

    async postGet(id, user) {
        let post = await this.moduleCall("/post", "single", id, user && user.email);

        if(post) {
            post = Object.assign(post, { media: await this.moduleCall("/media", "single", post.featured_media) });

            delete post.featured_media;
        }

        return post;
    }

    async postLike(id, user) {
        return await this.moduleCall("/post/like", "toggle", id, user && user.email);
    }

    async postsLikeGet(identities, user) {
        return await this.moduleCall("/post/like", "get", identities, user && user.email);
    }
}