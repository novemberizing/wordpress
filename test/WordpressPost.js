import WordpressUrl from "../src/WordpressUrl.js";
import WordpressPost from "../src/WordpressPost.js";

describe("WordpressPost", () => {
    WordpressUrl.config = {
        host: "https://content.bubus.co.kr",
        path: "?rest_route="
    };
    it("get", async () => {
        const o = await WordpressPost.get();
        console.log(o);
    });
});