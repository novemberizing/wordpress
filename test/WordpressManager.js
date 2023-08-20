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

        console.log(await Application.call("/wordpress", "post"));

        await Application.off();
    });
});