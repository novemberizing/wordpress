import { ApplicationServerServiceModule } from "@novemberizing/app";

export default class WordpressMedia extends ApplicationServerServiceModule {
    static hide(media) {
        console.log(media);
        if(media) {
            
        }
        return media;
    }
    constructor(service, config) {
        super("/post", service, config);
    }
}