import Application from "@novemberizing/app";
import Config from "@novemberizing/config";
import Log from "@novemberizing/log";
import WordpressManager from "../src/WordpressManager.js";

Log.config = {
    path: "",
    name: "",
    error: false,
    warning: false,
    caution: false,
    information: false,
    debug: false,
    verbose: false
};

describe("WordpressManager", () => {
    it("Post", async () => {
        Application.use(WordpressManager);

        await Application.on(await Config.gen({ url: "fs://./test/WordpressManager.configure.json" }));

        console.log(await Application.call("/wordpress", 'postGet', 0, { email: "novemberizing@gmail.com" }));



        console.log(await Application.call("/wordpress", "postLike", 7, { email: "novemberizing@gmail.com" }));

        await Application.off();
    });
});
