import { Query } from "./query";
import { AxiosInstance } from "@contentstack/core";

export default class TaxonomyQuery extends Query {
    constructor(client: AxiosInstance) {
        super(client, 'taxonomy'); // will need make changes to Query class so that CT uid is not mandatory
        this._client = client;
        this._urlPath = `/taxonomies/entries`;
    }
};