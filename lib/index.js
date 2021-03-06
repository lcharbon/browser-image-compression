import { addWhiteBackground, drawImageInCanvas, getDataUrlFromFile, getFilefromDataUrl, loadImage, getExifOrientation } from './utils.js';

/**
 * Compress an image file.
 *
 * @param {File} file
 * @param {number} [maxSizeMB=Number.POSITIVE_INFINITY]
 * @param {number} [maxWidthOrHeight]
 * @returns {Promise.<File>}
 */
async function imageCompression(file, maxSizeMB = Number.POSITIVE_INFINITY, maxWidthOrHeight, targetType) {
  targetType = targetType || file.type;

  if (!(file instanceof Blob || file instanceof File)) {
    throw new Error('The file given is not an instance of Blob or File');
  } else if (!/^image/.test(file.type)) {
    throw new Error('The file given is not an image');
  }

  let compressedFile;
  let remainingTrials = 5;
  const isNativeFile = window && (file instanceof window.File);
  const maxSizeByte = maxSizeMB * 1024 * 1024;

  const dataUrl = await getDataUrlFromFile(isNativeFile? file : Object.assign({}, file));
  const exifOrientation = await getExifOrientation(isNativeFile ? file : Object.assign({}, file));
  const img = await loadImage(dataUrl);
  const canvas = drawImageInCanvas(img, maxWidthOrHeight, exifOrientation);

  let quality = 0.9;
  
  if (targetType === 'image/png') {
    do {
      canvas.width *= 0.9;
      canvas.height *= 0.9;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL(targetType, quality, function() {});
      compressedFile = await getFilefromDataUrl(compressedDataUrl, file.name, file.lastModified);
    } while (remainingTrials-- && compressedFile.size > maxSizeByte);
  } else {
    // PNGs have transparent black background by default.
    if (file.type === 'image/png') addWhiteBackground(canvas);

    do {
      quality *= 0.9;
      const compressedDataUrl = canvas.toDataURL(targetType, quality, function() {});
      compressedFile = await getFilefromDataUrl(compressedDataUrl, file.name, file.lastModified);
    } while (remainingTrials-- && compressedFile.size > maxSizeByte);
  }

  return compressedFile;

}

imageCompression.drawImageInCanvas = drawImageInCanvas;
imageCompression.getDataUrlFromFile = getDataUrlFromFile;
imageCompression.getFilefromDataUrl = getFilefromDataUrl;
imageCompression.loadImage = loadImage;

export default imageCompression;