import { QueryOperation, QueryOperator, TaxonomyQueryOperation } from "../../src/lib/types";
import { stackInstance } from "../utils/stack-instance";
import dotenv from "dotenv"
import { TEntries } from "./types";

dotenv.config();
jest.setTimeout(60000);

const stack = stackInstance();

describe('Taxonomy API test cases', () => {
    it('Taxonomies Endpoint: Get Entries With One Term', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', QueryOperation.EQUALS, 'term_one')
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    });
    
    it('Taxonomies Endpoint: Get Entries With Any Term ($in)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', QueryOperation.INCLUDES, ['term_one', 'term_two']);
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Any Term ($or)', async () => {
        let taxonomyQuery1 = stack.Taxonomy().where('taxonomies.one', QueryOperation.EQUALS, 'term_one');
        let taxonomyQuery2 = stack.Taxonomy().where('taxonomies.two', QueryOperation.EQUALS, 'term_two');
        let taxonomyQuery = stack.Taxonomy().queryOperator(QueryOperator.OR, taxonomyQuery1, taxonomyQuery2);
        const data = await taxonomyQuery.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With All Terms ($and)', async () => {
        let taxonomyQuery1 = stack.Taxonomy().where('taxonomies.one', QueryOperation.EQUALS, 'term_one');
        let taxonomyQuery2 = stack.Taxonomy().where('taxonomies.two', QueryOperation.EQUALS, 'term_two');
        let taxonomyQuery = stack.Taxonomy().queryOperator(QueryOperator.AND, taxonomyQuery1, taxonomyQuery2);
        const data = await taxonomyQuery.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Any Taxonomy Terms ($exists)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', QueryOperation.EXISTS, true)
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Taxonomy Terms and Also Matching Its Children Term ($eq_below, level)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', TaxonomyQueryOperation.EQ_BELOW, 'term_one', {"levels": 1})
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Taxonomy Terms Children\'s and Excluding the term itself ($below, level)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', TaxonomyQueryOperation.BELOW, 'term_one', {"levels": 1})
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', TaxonomyQueryOperation.EQ_ABOVE, 'term_one', {"levels": 1})
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    test('Taxonomies Endpoint: Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)', async () => {
        let taxonomy = stack.Taxonomy().where('taxonomies.one', TaxonomyQueryOperation.ABOVE, 'term_one_child', {"levels": 1})
        const data = await taxonomy.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
});