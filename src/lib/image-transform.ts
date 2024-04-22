/* eslint-disable @cspell/spellchecker */
import './string-extensions';
import {
  CanvasBy,
  CropBy,
  FitBy,
  Format,
  Orientation,
  OverlayAlign,
  OverlayRepeat,
  ResizeFilter,
  TransformData,
} from './types';

export class imageTransform {
  obj: TransformData = {};

  /**
   * @method auto
   * @memberof ImageTransform
   * @description The auto parameter lets you enable the functionality that automates certain image optimization features.
   * @returns {ImageTransform}
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().auto();
   *
   * const transformURL = url.transform(transformObj);
   */
  auto(): imageTransform {
    this.obj.auto = 'webp';

    return this;
  }

  /**
   * @method quality
   * @memberof ImageTransform
   * @description The quality parameter lets you control the compression level of images that have Lossy file format.
   * @param {number} qualityNum - Quality range: 1-100.
   * @returns {ImageTransform}
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().quality(50);
   *
   * const transformURL = url.transform(transformObj);
   */
  quality(qualityNum: number): imageTransform {
    this.obj.quality = qualityNum.toString();

    return this;
  }

  /**
   * @method format
   * @memberof ImageTransform
   * @description The format parameter lets you converts a given image from one format to another.
   * @param {Format} format - Specifies the format to change to.
   * @returns {ImageTransform}
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().format(Format.PJPG);
   *
   * const transformURL = url.transform(transformObj);
   */
  format(format: Format): imageTransform {
    this.obj.format = format;

    return this;
  }

  /**
   * @method resize
   * @memberof ImageTransform
   * @description The resize parameter lets you resize the image in terms of width, height, upscaling the image.
   * @param {string | number} width - Specifies the width to resize the image to.
   * The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')
   * @param {string | number} height - Specifies the height to resize the image to.
   * The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')
   * @param {string} disable - The disable parameter disables the functionality that is enabled by default.
   * As of now, there is only one value, i.e., upscale, that you can use with the disable parameter.
   * @returns {ImageTransform}
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().resize({ width: 200, height: 200, disable: 'upscale' });
   *
   * const transformURL = url.transform(transformObj);
   */
  resize({
    width,
    height,
    disable,
  }: {
    width?: string | number;
    height?: string | number;
    disable?: string;
  }): imageTransform {
    if (width) this.obj.width = width.toString();
    if (height) this.obj.height = height.toString();
    if (disable) this.obj.disable = 'upscale';

    return this;
  }

  /**
   * @method crop
   * @memberof ImageTransform
   * @description The crop parameter allows you to remove pixels from an image. You can crop an image by specifying
   * the height and width in pixels or percentage value, or defining height and width in aspect ratio.
   * You can also define a sub region (i.e., define the starting point for crop) before cropping the image,
   * or you can offset the image on its X and Y axis (i.e., define the centre point of the crop) before cropping the image.
   * @returns {ImageTransform}
   * @param {string | number} width - Specifies the width to resize the image to.
   * The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')
   * @param {string | number} height - Specifies the height to resize the image to.
   * The value can be in pixels (for example, 400) or in percentage (for example, 0.60 OR '60p')
   * @param {string | number} xval - (Optional) For CropBy Region, xval defines the X-axis position
   * of the top left corner of the crop. For CropBy Offset, xval defines the horizontal offset of the crop region.
   * @param {string | number} yval - (Optional) For CropBy Region, yval defines the Y-axis position
   * of the top left corner of the crop. For CropBy Offset, yval defines the vertical offset of the crop region.
   * @param {CropBy} cropBy - (Optional) Specifies the CropBy type. Values are DEFAULT, ASPECTRATIO, REGION, OFFSET.
   * @param {boolean} safe - (Optional) Ensures that the output image never returns an error due to the specified crop area being
   * out of bounds. The output image is returned as an intersection of the source image and the defined crop area.
   * @param {boolean} smart - (Optional) Ensures crop is done using content-aware algorithms. Content-aware image cropping returns a
   * cropped image that automatically fits the defined dimensions while intelligently including the most important components of the image.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().crop({ width: 100, height: 200 })
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().crop({ width: 2, height: 3, cropBy: CropBy.ASPECTRATIO })
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().crop({ width: 200, height: 300, cropBy: CropBy.REGION, xval: 100, yval: 150 })
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().crop({ width: 200, height: 300, cropBy: CropBy.OFFSET, xval: 100, yval: 150 })
   *
   * const transformURL = url.transform(transformObj);
   */
  crop({
    width,
    height,
    xval,
    yval,
    cropBy = CropBy.DEFAULT,
    safe = false,
    smart = false,
  }: {
    width: string | number;
    height: string | number;
    xval?: string | number;
    yval?: string | number;
    cropBy?: CropBy;
    safe?: boolean;
    smart?: boolean;
  }): imageTransform {
    switch (cropBy) {
      case CropBy.DEFAULT: {
        this.obj.crop = [width.toString(), height.toString()];
        break;
      }
      case CropBy.ASPECTRATIO: {
        this.obj.crop = `${width}:${height}`;
        break;
      }
      case CropBy.REGION: {
        this.obj.crop = [width.toString(), height.toString(), `x${xval}`, `y${yval}`];
        break;
      }
      case CropBy.OFFSET: {
        this.obj.crop = [width.toString(), height.toString(), `offset-x${xval}`, `offset-y${yval}`];
      }
    }
    if (safe) this.obj.crop = [...this.obj.crop, 'safe'];
    if (smart) this.obj.crop = [...this.obj.crop, 'smart'];

    return this;
  }

  /**
   * @method fit
   * @memberof ImageTransform
   * @description The fit parameter enables you to fit the given image properly within the specified height and width.
   * @returns {ImageTransform}
   * @param {FitBy} type - Specifies fit type (BOUNDS or CROP).
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().resize({ width: 200, height: 200 }).fit(FitBy.BOUNDS);
   *
   * const transformURL = url.transform(transformObj);
   */
  fit(type: FitBy): imageTransform {
    this.obj.fit = type;

    return this;
  }

  /**
   * @method trim
   * @memberof ImageTransform
   * @description The trim parameterlets you trim an image from the edges. This is especially useful for removing border or white spaces.
   * @returns {ImageTransform}
   * @param {number | number[]} trimValues - specifies values for top, right, bottom, and left edges of an image.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().trim([25, 50, 75, 90]);
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().trim([25, 50, 25]);
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().trim(50);
   *
   * const transformURL = url.transform(transformObj);
   */
  trim(trimValues: number | number[]): imageTransform {
    this.obj.trim = trimValues.toString();

    return this;
  }

  /**
   * @method orient
   * @memberof ImageTransform
   * @description The orient parameter lets you control the cardinal orientation of the given image. Using this parameter,
   * you can orient the image right or left, flip horizontally or vertically or both
   * @returns {ImageTransform}
   * @param {Orientation} orientType - Type of Orientation. Values are DEFAULT, FLIP_HORIZONTAL, FLIP_HORIZONTAL_VERTICAL,
   * FLIP_VERTICAL, FLIP_HORIZONTAL_LEFT, RIGHT, FLIP_HORIZONTAL_RIGHT, LEFT.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().orient(Orientation.FLIP_HORIZONTAL);
   *
   * const transformURL = url.transform(transformObj);
   */
  orient(orientType: Orientation): imageTransform {
    this.obj.orient = orientType.toString();

    return this;
  }

  /**
   * @method overlay
   * @memberof ImageTransform
   * @description The overlay parameter allows you to put one image on top of another.
   * You need to specify the relative URL of the image as value for this parameter.
   * @returns {ImageTransform}
   * @param {string} relativeURL - URL of the image to overlay on base image
   * @param {OverlayAlign | OverlayAlign[]} align - lets you define the position of the overlay image.
   * Accepted values are TOP, BOTTOM, LEFT, RIGHT, MIDDLE, CENTER.
   * @param {OverlayRepeat} repeat - lets you define how the overlay image will be repeated on the given image.
   * Accepted values are X, Y, BOTH.
   * @param {string | number} width - lets you define the width of the overlay image.
   * For pixels, use any whole number between 1 and 8192. For percentages, use any decimal number between 0.0 and 0.99.
   * @param {string | number} height - lets you define the height of the overlay image.
   * For pixels, use any whole number between 1 and 8192. For percentages, use any decimal number between 0.0 and 0.99
   * @param {number | number[]} pad - lets you add extra pixels to the edges of an image. 
   * This is useful if you want to add whitespace or border to an image.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().overlay({ relativeURL: overlayImgURL });
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().overlay({ relativeURL: overlayImgURL, align: OverlayAlign.BOTTOM });
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().overlay({
   *                        relativeURL: overlayImgURL,
   *                        align: OverlayAlign.BOTTOM,
   *                        repeat: OverlayRepeat.Y,
   *                        width: '50p',
   *                      });
   *
   * const transformURL = url.transform(transformObj);
   */
  overlay({
    relativeURL,
    align,
    repeat,
    width,
    height,
  }: {
    relativeURL: string;
    align?: OverlayAlign | OverlayAlign[];
    repeat?: OverlayRepeat;
    width?: string | number;
    height?: string | number;
    pad?: number | number[];
  }): imageTransform {
    this.obj.overlay = relativeURL;
    if (align) this.obj['overlay-align'] = align.toString();
    if (repeat) this.obj['overlay-repeat'] = repeat.toString();
    if (width) this.obj['overlay-width'] = width.toString();
    if (height) this.obj['overlay-height'] = height.toString();

    return this;
  }

  /**
   * @method padding
   * @memberof ImageTransform
   * @description The padding parameter lets you add extra pixels to the edges of an image. 
   * This is useful if you want to add whitespace or border to an image.
   * @returns {ImageTransform}
   * @param {number | number[]} padding - padding value in pixels or percentages
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().padding([25, 50, 75, 90]);
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().padding(50);
   *
   * const transformURL = url.transform(transformObj);
   */
  padding(padding: number | number[]): imageTransform {
    this.obj.pad = padding.toString();

    return this;
  }

  /**
   * @method bgColor
   * @memberof ImageTransform
   * @description The bgColor parameter lets you set a backgroud color for the given image.
   * @returns {ImageTransform}
   * @param {string | number[]} color - color of the background
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().bgColor('cccccc');
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().bgColor([140, 220, 123, 0.5] );
   *
   * const transformURL = url.transform(transformObj);
   */
  bgColor(color: string | number[]): imageTransform {
    this.obj['bg-color'] = color.toString();

    return this;
  }

  /**
   * @method dpr
   * @memberof ImageTransform
   * @description The dpr parameter lets you deliver images with appropriate size to devices that come with a defined device pixel ratio.
   * @returns {ImageTransform}
   * @param {number} dprValue - value of device pixel ratio 1-10000 or 0.0 to 9999.999
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().resize({ width: 300, height: 500 }).dpr(10);
   *
   * const transformURL = url.transform(transformObj);
   */
  dpr(dprValue: number): imageTransform {
    this.obj.dpr = dprValue.toString();

    return this;
  }

  /**
   * @method blur
   * @memberof ImageTransform
   * @description The blur parameter allows you to decrease the focus and clarity of a given image.
   * @returns {ImageTransform}
   * @param {number} blurValue - to set the blur intensity between 1-1000.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().blur(10);
   *
   * const transformURL = url.transform(transformObj);
   */
  blur(blurValue: number): imageTransform {
    this.obj.blur = blurValue.toString();

    return this;
  }

  /**
   * @method frame
   * @memberof ImageTransform
   * @description The frame parameter fetches the first frame from an animated GIF (Graphics Interchange Format)
   * file that comprises a sequence of moving images.
   * @returns {ImageTransform}
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().frame();
   *
   * const transformURL = url.transform(transformObj);
   */
  frame(): imageTransform {
    this.obj.frame = '1';

    return this;
  }

  /**
   * @method sharpen
   * @memberof ImageTransform
   * @description The sharpen parameter allows you to increase the definition of the edges of objects in an image.
   * @returns {ImageTransform}
   * @param {number} amount - [0-10] specifies the amount of contrast to be set for the image edges
   * @param {number} radius - [1-1000] specifies the radius of the image edges
   * @param {number} threshold - [0-255] specifies the range of image edges that need to be ignored while sharpening
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().sharpen(5, 1000, 2);
   *
   * const transformURL = url.transform(transformObj);
   */
  sharpen(amount: number, radius: number, threshold: number): imageTransform {
    this.obj.sharpen = [`a${amount}`, `r${radius}`, `t${threshold}`].toString();

    return this;
  }

  /**
   * @method saturation
   * @memberof ImageTransform
   * @description The saturation parameter allows you to increase or decrease the intensity of the colors in a given image.
   * @returns {ImageTransform}
   * @param {number} saturationValue - to set the saturation of image between -100 to 100
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().saturation(-80.99);
   *
   * const transformURL = url.transform(transformObj);
   */
  saturation(saturationValue: number): imageTransform {
    this.obj.saturation = saturationValue.toString();

    return this;
  }

  /**
   * @method contrast
   * @memberof ImageTransform
   * @description The contrast parameter lets you enable the functionality that automates certain image optimization features.
   * @returns {ImageTransform}
   * @param {number} contrastValue - to set the contrast of image between -100 to 100
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().contrast(-80.99);
   *
   * const transformURL = url.transform(transformObj);
   */
  contrast(contrastValue: number): imageTransform {
    this.obj.contrast = contrastValue.toString();

    return this;
  }

  /**
   * @method brightness
   * @memberof ImageTransform
   * @description The brightness parameter lets you enable the functionality that automates certain image optimization features.
   * @returns {ImageTransform}
   * @param {number} contrastValue - to set the brightness of image between -100 to 100
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().brightness(80.50);
   *
   * const transformURL = url.transform(transformObj);
   */
  brightness(brightnessValue: number): imageTransform {
    this.obj.brightness = brightnessValue.toString();

    return this;
  }

  /**
   * @method resizeFilter
   * @memberof ImageTransform
   * @description The resizeFilter parameter allows you to use the resizing filter to increase or
   * decrease the number of pixels in a given image.
   * @returns {ImageTransform}
   * @param {ResizeFilter} type - type of Filter to apply
   * Values are NEAREST, BILINEAR, BICUBIC, LANCZOS2, LANCZOS3.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().resize({ width: 500, height: 550 }).resizeFilter(ResizeFilter.NEAREST);
   *
   * const transformURL = url.transform(transformObj);
   */
  resizeFilter(type: ResizeFilter): imageTransform {
    this.obj['resize-filter'] = type;

    return this;
  }

  /**
   * @method canvas
   * @memberof ImageTransform
   * @description The canvas parameter allows you to increase the size of the canvas that surrounds an image.
   * You can specify the height and width of the canvas area in pixels or percentage or define the height and width
   * of the aspect ratio of the canvas. You can also define the starting point for the canvas area or offset the canvas on its X and Y axis.
   * @returns {ImageTransform}
   * @param {string | number} width - sets width of the canvas
   * @param {string | number} height - sets height of the canvas
   * @param {string | number} xval - defines the X-axis position of the top left corner or horizontal offset
   * @param {string | number} yval - defines the Y-axis position of the top left corner or vertical offset
   * @param {CanvasBy} canvasBy - Specifies the canvasBy type. Accepted values are DEFAULT, ASPECTRATIO, REGION, OFFSET.
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().canvas({ width: 100, height: 200 });
   *
   * const transformURL = url.transform(transformObj);
   * @example
   * const url = 'www.example.com';
   * const transformObj = new ImageTransform().canvas({ width: 200, height: 300, canvasBy: CanvasBy.OFFSET, xval: 100, yval: 150 });
   *
   * const transformURL = url.transform(transformObj);
   */
  canvas({
    width,
    height,
    xval,
    yval,
    canvasBy = CanvasBy.DEFAULT,
  }: {
    width: string | number;
    height: string | number;
    xval?: string | number;
    yval?: string | number;
    canvasBy?: CanvasBy;
  }): imageTransform {
    switch (canvasBy) {
      case CanvasBy.DEFAULT: {
        this.obj.canvas = [width.toString(), height.toString()];
        break;
      }
      case CanvasBy.ASPECTRATIO: {
        this.obj.canvas = `${width}:${height}`;
        break;
      }
      case CanvasBy.REGION: {
        this.obj.canvas = [width.toString(), height.toString()];
        if (xval) this.obj.canvas.push(`x${xval}`);
        if (yval) this.obj.canvas.push(`y${yval}`);
        break;
      }
      case CanvasBy.OFFSET: {
        this.obj.canvas = [width.toString(), height.toString()];
        if (xval) this.obj.canvas.push(`offset-x${xval}`);
        if (yval) this.obj.canvas.push(`offset-y${yval}`);
      }
    }

    return this;
  }
}
