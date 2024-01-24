import { TaxonomyQuery } from "../../src/lib/taxonomy-query";
import { AxiosInstance, HttpClientParams, httpClient } from "@contentstack/core";
import MockAdapter from 'axios-mock-adapter';
import { QueryOperation, QueryOperator, TaxonomyQueryOperation } from "../../src/lib/types";

describe("Taxonomy-query class", () => {
    let taxonomyQuery: TaxonomyQuery;
    let client: AxiosInstance;
    let clientConfig: HttpClientParams;

    beforeAll(() => {
        clientConfig = {
            apiKey: 'API_KEY',
            accessToken: 'DELIVERY_TOKEN',
        };
        client = httpClient(clientConfig);
    })

    beforeEach(() => {
        taxonomyQuery = new TaxonomyQuery(client);
    })

    it('Taxonomy Query: Get entries with one term', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", QueryOperation.EQUALS, "term_uid").getQuery();
        expect(query).toEqual({"taxonomies.taxonomy_uid": "term_uid"});
    });

    it('Taxonomy Query: Get entries with any term ($in)', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", QueryOperation.INCLUDES, ["term_uid1", "term_uid2"]).getQuery();
        expect(query).toEqual({"taxonomies.taxonomy_uid": { "$in": ["term_uid1", "term_uid2"] }});
    });

    it('Taxonomy Query: Get entries with any term ($or)', () => {
        const query1 = new TaxonomyQuery(client).where("taxonomies.taxonomy_uid1",QueryOperation.EQUALS, "term_uid1");
        const query2 = new TaxonomyQuery(client).where("taxonomies.taxonomy_uid2",QueryOperation.EQUALS, "term_uid2");
        const query = taxonomyQuery.queryOperator(QueryOperator.OR, query1, query2);
        expect(query._parameters).toEqual({ $or: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ] });
    });

    it('Taxonomy Query: Get entries with all term ($and)', () => {
        const query1 = new TaxonomyQuery(client).where("taxonomies.taxonomy_uid1", QueryOperation.EQUALS, "term_uid1");
        const query2 = new TaxonomyQuery(client).where("taxonomies.taxonomy_uid2", QueryOperation.EQUALS, "term_uid2");
        const query = taxonomyQuery.queryOperator(QueryOperator.AND, query1, query2);
        expect(query._parameters).toEqual({$and: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ]});
    });

    it('Taxonomy Query: Get entries with any taxonomy terms ($exists)', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", QueryOperation.EXISTS, true);
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": {$exists: true}});
    });

    it('Taxonomy Query: Get entries with taxonomy terms and also matching its children terms ($eq_below, level)', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", TaxonomyQueryOperation.EQ_BELOW, "term_uid", {"levels": 4});
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": {"$eq_below": "term_uid", "levels": 4 }});
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Children\'s and Excluding the term itself ($below, level) ', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", TaxonomyQueryOperation.BELOW, "term_uid");
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": {"$below": "term_uid" }});
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", TaxonomyQueryOperation.EQ_ABOVE, "term_uid", {"levels": 4});
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": {"$eq_above": "term_uid", "levels": 4 }});
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", TaxonomyQueryOperation.ABOVE, "term_uid", {"levels": 4});
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": {"$above": "term_uid", "levels": 4 }});
    });

    test('Taxonomy Query: Get All Entries With Taxonomy For One Content type', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", QueryOperation.EQUALS, "term_uid").where("_content_type", QueryOperation.EQUALS, "ct1");
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": "term_uid", "_content_type": "ct1"});
    });

    test('Taxonomy Query: Get All Entries With Taxonomy For Multiple Content types', () => {
        const query = taxonomyQuery.where("taxonomies.taxonomy_uid", QueryOperation.EQUALS, "term_uid").where("_content_type", QueryOperation.INCLUDES, ["ct1", "ct2"]);
        expect(query._parameters).toEqual({"taxonomies.taxonomy_uid": "term_uid", "_content_type": {$in: ["ct1", "ct2"]}});
    });
})