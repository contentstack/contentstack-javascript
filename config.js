const config = {
    protocol: "https",
    host: "dev-cdn.contentstack.io",
    port: 443,
    version: "v3",
    urls: {
        sync: "/stacks/sync",
        content_types: "/content_types/",
        entries: "/entries/",
        assets: "/assets/",
        environments: "/environments/"
    }
};

export default config;