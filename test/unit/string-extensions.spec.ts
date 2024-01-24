import { ImageTransform } from '../../src/lib/image-transform';
import '../../src/lib/string-extensions';

describe('String Extension', () => {
  it('should return correct string value', () => {
    const url = 'www.example.com';
    const transformObj = new ImageTransform().resize({ width: 300 }).crop({ width: 100, height: 200 });
    const transformedURL = url + '?width=300&crop=100,200';
    expect(url.transform(transformObj)).toBe(transformedURL);
  });
});
