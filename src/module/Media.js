import { ApplicationServerServiceModule } from "@novemberizing/app";

import novemberizing from "../novemberizing.js";

export default class WordpressMedia extends ApplicationServerServiceModule {
    static #hide(media) {
        if(media) {
            media.alt = media.alt_text;
            media.type = media.media_type;
            media.width = media.media_details.width;
            media.height = media.media_details.height;
            media.url = media.source_url;

            delete media.date;
            delete media.date_gmt;
            delete media.guid;
            delete media.modified;
            delete media.modified_gmt;
            delete media.slug;
            delete media.status;
            delete media.type;
            delete media.link;
            delete media.title;
            delete media.author;
            delete media.comment_status;
            delete media.ping_status;
            delete media.template;
            delete media.meta;
            delete media.description;
            delete media.caption;
            delete media.alt_text;
            delete media.media_type;
            delete media.mime_type;
            delete media.media_details;
            delete media.post;
            delete media.source_url;
            delete media._links;
        }
        return media;
    }

    #host = null;

    constructor(service, config) {
        super("/media", service, config);

        if(config.host) {
            this.#host = config.host;
        } else if(service.config.host) {
            this.#host = service.config.host;
        }
    }

    async single(id) {
        if(id) return WordpressMedia.#hide(await novemberizing.http.get(`${this.#host}/wp/v2/media/${id}`));

        throw new Error();      // TODO
    }

    async multiple(identities) {
        return WordpressMedia.#hide(await novemberizing.http.get(`${this.#host}/wp/v2/media?includes=${identities}`));
    }
}