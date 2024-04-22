import { imageTransform } from './image-transform';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface String {
    transform(imageTransform: imageTransform): string;
  }
}

String.prototype.transform = function (imageTransform: imageTransform): string {
  let result = this.toString();
  const queryString = Object.entries(Object.assign({}, imageTransform.obj))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  if (queryString) {
    result += `?${queryString}`;
  }

  return result;
};

export {};
