const config = {
    protocol: "https",
    host: "cdn.contentstack.io",
    port: 443,
    version: "v3",
    urls: {
        sync: "/stacks/sync",
        content_types: "/content_types/",
        entries: "/entries/",
        assets: "/assets/",
        environments: "/environments/",
        taxonomies: "/taxonomies/entries"
    },
    live_preview: {
        enable: false,
        host: 'rest-preview.contentstack.com'
    }
};

export default config;