import * as Contentstack from "../..";


describe("Live preview config", () => {
    test("should have default values when not initialized", () => {
        expect(1).toBe(1);

        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
        });

        // @ts-expect-error
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).not.toBeUndefined();

        expect(livePreviewObject).toHaveProperty("enable");
        expect(livePreviewObject).toHaveProperty("host");
        expect(livePreviewObject).not.toHaveProperty("preview");

        expect(livePreviewObject.enable).toBe(false);
        expect(livePreviewObject.host).toBe("rest-preview.contentstack.com");
    });

    test("should set preview token if passed", () => {
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: true,
                preview_token: "preview_token",
            },
        });

        // @ts-expect-error
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).not.toBeUndefined();

        expect(livePreviewObject.enable).toBe(true);
        expect(livePreviewObject.preview_token).toBe("preview_token");
        expect(livePreviewObject.host).toBe("rest-preview.contentstack.com");
    });

    test("should set management token if passed", () => {
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: true,
                management_token: "management_token",
            },
        });

        // @ts-expect-error
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).not.toBeUndefined();

        expect(livePreviewObject.enable).toBe(true);
        expect(livePreviewObject.management_token).toBe("management_token");
        expect(livePreviewObject.host).toBe("api.contentstack.io");
    });

    test("should set host if passed", () => {
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: true,
                preview_token: "preview_token",
                host: "custom-host",
            },
        });

        // @ts-expect-error
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).not.toBeUndefined();

        expect(livePreviewObject.host).toBe("custom-host");
    });
});

describe("Live preview realtime URL switch", () => {
    class Plugin {
        constructor(public tester: typeof jest.fn) {}
        onRequest(_: any, request: any) {
            this.tester(request);
            return request;
        }
    }
    test("should make the call to the CDN if the live preview disabled", async () => {
        const tester = jest.fn();
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: false,
                preview_token: "preview_token",
                host: "api.contentstack.io",
            },

            plugins: [new Plugin(tester)],
        });

        stack.livePreviewQuery({
            content_type_uid: "some-other-ct",
            live_preview: "ser",
        });

        try {
            await stack.ContentType("he").Entry("ser").fetch();
        } catch (e) {}

        expect(tester).toBeCalledTimes(1);
        expect(tester.mock.calls[0][0].url).toContain("cdn.contentstack.io");
        expect(tester.mock.calls[0][0].option.headers.access_token).toBe(
            "delivery_token"
        );
    });

    test("should make the call with preview token to the Preview server if the live preview matches", async () => {
        const tester = jest.fn();
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: true,
                preview_token: "preview_token",
                host: "preview-api.contentstack.io",
            },
            fetchOptions: {
                retryLimit: 0,
                retryDelay: 0,
                timeout: 0,
            },

            plugins: [new Plugin(tester)],
        });

        stack.livePreviewQuery({
            content_type_uid: "he",
            live_preview: "ser",
        });

        try {
            stack.ContentType("he").Entry("ser").fetch().catch();
        } catch (e) {}

        expect(tester).toBeCalledTimes(1);
        expect(tester.mock.calls[0][0].url).toContain(
            "preview-api.contentstack.io"
        );

        expect(tester.mock.calls[0][0].option.headers.preview_token).toBe(
            "preview_token"
        );
        expect(
            tester.mock.calls[0][0].option.headers.authorization
        ).toBeUndefined();

        //@ts-expect-error
        delete stack.live_preview.preview_token;
    });

    test("should make the call with authorization to the Preview server if the live preview matches", async () => {
        const tester = jest.fn();
        const stack = Contentstack.Stack({
            api_key: "api_key",
            delivery_token: "delivery_token",
            environment: "environment",
            live_preview: {
                enable: true,
                management_token: "management_token",
            },
            fetchOptions: {
                retryLimit: 0,
                retryDelay: 0,
                timeout: 0,
            },

            plugins: [new Plugin(tester)],
        });

        stack.livePreviewQuery({
            content_type_uid: "he",
            live_preview: "ser",
        });

        try {
            stack.ContentType("he").Entry("ser").fetch().catch();
        } catch (e) {}

        expect(tester).toBeCalledTimes(1);
        expect(tester.mock.calls[0][0].url).toContain("api.contentstack.io");

        expect(tester.mock.calls[0][0].option.headers.authorization).toBe(
            "management_token"
        );
        expect(
            tester.mock.calls[0][0].option.headers.preview_token
        ).toBeUndefined();
    });
});
