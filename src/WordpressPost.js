import WordpressUrl from "./WordpressUrl.js";

import axios from "axios";

export default class WordpressPost {
    static #remove(post) {
        delete post.guid;
        delete post.status;
        delete post.post;
        delete post.link;
        post.title = post.title.rendered;
        post.content = post.content.rendered;
        delete post.author;
        delete post.comment_status;
        delete post.ping_status;
        delete post.sticky;
        delete post.template;
        delete post.meta;
        delete post.categories;
        delete post.tags;
        delete post._links;
        delete post.type;
        delete post.excerpt;
        delete post.format;

        /** 포스트를 가지고 오면서 컨텐츠에 존재하는 CLASS 를 지운다. */

        return post;
    }
    static async get() {
        const o = await axios.get(WordpressUrl.gen("/wp/v2/posts"));

        /** 사용하지 않는 데이터를 없앤다. */
        const posts = o.data.map(WordpressPost.#remove);

        for(const post of posts) {
            console.log(post);
        }
        
        return posts;
    }
}