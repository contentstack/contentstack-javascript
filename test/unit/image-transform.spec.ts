/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/naming-convention */
import { imageTransform } from '../../src/lib/image-transform';
import {
  CanvasBy,
  CropBy,
  FitBy,
  Format,
  Orientation,
  OverlayAlign,
  OverlayRepeat,
  ResizeFilter,
} from '../../src/lib/types';

describe('ImageTransform class', () => {
  function getBuild(imgTransformObj: imageTransform) {
    return { ...imgTransformObj.obj };
  }

  it('should return empty object when ImageTransform object is created', () => {
    const imgTObj = getBuild(new imageTransform());
    expect(imgTObj).toEqual({});
  });
  it('should return valid object with auto:webp when auto method is called without any param', () => {
    const imgTObj = getBuild(new imageTransform().auto());
    expect(imgTObj).toEqual({ auto: 'webp' });
  });
  it('should return valid object when quality method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().quality(50));
    expect(imgTObj).toEqual({ quality: '50' });
  });
  it('should return valid object when format method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().format(Format.PJPG));
    expect(imgTObj).toEqual({ format: 'pjpg' });
  });
  it('should return valid object when resize method is called with valid params', () => {
    expect(getBuild(new imageTransform().resize({ width: 200 }))).toEqual({ width: '200' });
    expect(getBuild(new imageTransform().resize({ height: 200 }))).toEqual({ height: '200' });
    expect(getBuild(new imageTransform().resize({ disable: 'upscale' }))).toEqual({ disable: 'upscale' });
    expect(getBuild(new imageTransform().resize({ width: 200, height: 200, disable: 'upscale' }))).toEqual({
      disable: 'upscale',
      width: '200',
      height: '200',
    });
  });

  it('should return valid object when crop method is called with valid params', () => {
    expect(getBuild(new imageTransform().crop({ width: 100, height: 200 }))).toEqual({ crop: ['100', '200'] });
    expect(getBuild(new imageTransform().crop({ width: 2, height: 3, cropBy: CropBy.ASPECTRATIO }))).toEqual({
      crop: '2:3',
    });
    expect(
      getBuild(new imageTransform().crop({ width: 200, height: 300, cropBy: CropBy.REGION, xval: 100, yval: 150 }))
    ).toEqual({
      crop: ['200', '300', 'x100', 'y150'],
    });
    expect(
      getBuild(new imageTransform().crop({ width: 200, height: 300, cropBy: CropBy.OFFSET, xval: 100, yval: 150 }))
    ).toEqual({
      crop: ['200', '300', 'offset-x100', 'offset-y150'],
    });
    expect(
      getBuild(
        new imageTransform().crop({
          width: 200,
          height: 300,
          cropBy: CropBy.REGION,
          xval: 100,
          yval: 150,
          safe: true,
        })
      )
    ).toEqual({
      crop: ['200', '300', 'x100', 'y150', 'safe'],
    });
    expect(
      getBuild(
        new imageTransform().crop({
          width: 200,
          height: 300,
          cropBy: CropBy.REGION,
          xval: 100,
          yval: 150,
          smart: true,
        })
      )
    ).toEqual({
      crop: ['200', '300', 'x100', 'y150', 'smart'],
    });
    expect(
      getBuild(
        new imageTransform().crop({
          width: 200,
          height: 300,
          cropBy: CropBy.REGION,
          xval: 100,
          yval: 150,
          smart: true,
          safe: true,
        })
      )
    ).toEqual({
      crop: ['200', '300', 'x100', 'y150', 'safe', 'smart'],
    });
  });

  it('should return valid object when fit method is called with valid params', () => {
    expect(getBuild(new imageTransform().fit(FitBy.BOUNDS))).toEqual({ fit: 'bounds' });
    expect(getBuild(new imageTransform().fit(FitBy.CROP))).toEqual({ fit: 'crop' });
  });

  it('should return valid object when trim method is called with valid params', () => {
    expect(getBuild(new imageTransform().trim([25, 50, 75, 90]))).toEqual({ trim: '25,50,75,90' });
    expect(getBuild(new imageTransform().trim([25, 50, 25]))).toEqual({ trim: '25,50,25' });
    expect(getBuild(new imageTransform().trim(50))).toEqual({ trim: '50' });
  });

  it('should return valid object when orient method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().orient(Orientation.FLIP_HORIZONTAL));
    expect(imgTObj).toEqual({ orient: '2' });
  });

  it('should return valid object when overlay method is called with valid params', () => {
    const overlayImgURL = '/v3/assets/circle.png';
    expect(getBuild(new imageTransform().overlay({ relativeURL: overlayImgURL }))).toEqual({ overlay: overlayImgURL });
    expect(getBuild(new imageTransform().overlay({ relativeURL: overlayImgURL, align: OverlayAlign.BOTTOM }))).toEqual({
      overlay: overlayImgURL,
      'overlay-align': OverlayAlign.BOTTOM,
    });
    expect(
      getBuild(
        new imageTransform().overlay({
          relativeURL: overlayImgURL,
          align: [OverlayAlign.BOTTOM, OverlayAlign.CENTER],
        })
      )
    ).toEqual({ overlay: overlayImgURL, 'overlay-align': 'bottom,center' });
    expect(
      getBuild(
        new imageTransform().overlay({
          relativeURL: overlayImgURL,
          align: OverlayAlign.BOTTOM,
          repeat: OverlayRepeat.X,
        })
      )
    ).toEqual({ overlay: overlayImgURL, 'overlay-align': 'bottom', 'overlay-repeat': 'x' });
    expect(
      getBuild(
        new imageTransform().overlay({
          relativeURL: overlayImgURL,
          align: OverlayAlign.BOTTOM,
          repeat: OverlayRepeat.Y,
          width: '50p',
        })
      )
    ).toEqual({
      overlay: overlayImgURL,
      'overlay-align': 'bottom',
      'overlay-repeat': 'y',
      'overlay-width': '50p',
    });
    expect(
      getBuild(
        new imageTransform().overlay({
          relativeURL: overlayImgURL,
          align: OverlayAlign.BOTTOM,
          repeat: OverlayRepeat.BOTH,
          height: 250,
        })
      )
    ).toEqual({
      overlay: overlayImgURL,
      'overlay-align': 'bottom',
      'overlay-repeat': 'both',
      'overlay-height': '250',
    });
  });

  it('should return valid object when padding method is called with valid params', () => {
    expect(getBuild(new imageTransform().padding([25, 50, 75, 90]))).toEqual({ pad: '25,50,75,90' });
    expect(getBuild(new imageTransform().padding([25, 50, 25]))).toEqual({ pad: '25,50,25' });
    expect(getBuild(new imageTransform().padding(50))).toEqual({ pad: '50' });
  });

  it('should return valid object when bgColor method is called with valid params', () => {
    expect(getBuild(new imageTransform().bgColor('cccccc'))).toEqual({ 'bg-color': 'cccccc' });
    expect(getBuild(new imageTransform().bgColor([140, 220, 123]))).toEqual({ 'bg-color': '140,220,123' });
    expect(getBuild(new imageTransform().bgColor([140, 220, 123, 0.5]))).toEqual({ 'bg-color': '140,220,123,0.5' });
  });

  it('should return valid object when dpr method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().resize({ width: 100, height: 200 }).dpr(10));
    expect(imgTObj).toEqual({ width: '100', height: '200', dpr: '10' });
  });

  it('should return valid object when blur method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().blur(10));
    expect(imgTObj).toEqual({ blur: '10' });
  });

  it('should return valid object when frame method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().frame());
    expect(imgTObj).toEqual({ frame: '1' });
  });

  it('should return valid object when sharpen method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().sharpen(5, 1000, 2));
    expect(imgTObj).toEqual({ sharpen: 'a5,r1000,t2' });
  });

  it('should return valid object when saturation method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().saturation(-80.99));
    expect(imgTObj).toEqual({ saturation: '-80.99' });
  });

  it('should return valid object when contrast method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().contrast(80.99));
    expect(imgTObj).toEqual({ contrast: '80.99' });
  });

  it('should return valid object when brightness method is called with valid params', () => {
    const imgTObj = getBuild(new imageTransform().brightness(80.99));
    expect(imgTObj).toEqual({ brightness: '80.99' });
  });

  it('should return valid object when resizeFilter method is called with valid params', () => {
    const imgTObj = getBuild(
      new imageTransform().resize({ width: 500, height: 550 }).resizeFilter(ResizeFilter.NEAREST)
    );
    expect(imgTObj).toEqual({ width: '500', height: '550', 'resize-filter': 'nearest' });
  });

  it('should return valid object when canvas method is called with valid params', () => {
    expect(getBuild(new imageTransform().canvas({ width: 100, height: 200 }))).toEqual({ canvas: ['100', '200'] });
    expect(getBuild(new imageTransform().canvas({ width: 2, height: 3, canvasBy: CanvasBy.ASPECTRATIO }))).toEqual({
      canvas: '2:3',
    });
    expect(
      getBuild(
        new imageTransform().canvas({ width: 200, height: 300, canvasBy: CanvasBy.REGION, xval: 100, yval: 150 })
      )
    ).toEqual({
      canvas: ['200', '300', 'x100', 'y150'],
    });
    expect(
      getBuild(
        new imageTransform().canvas({ width: 200, height: 300, canvasBy: CanvasBy.OFFSET, xval: 100, yval: 150 })
      )
    ).toEqual({
      canvas: ['200', '300', 'offset-x100', 'offset-y150'],
    });
  });
});
