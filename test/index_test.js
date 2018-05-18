import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { File, FileReader } from 'file-api';
import imageCompression, { drawImageInCanvas, getDataUrlFromFile, getFilefromDataUrl, loadImage } from '../';

const IMAGE_DIR = './example';
const FLIPED_NAME = "dinner.jpg";
const FLIPED_PATH = path.join(IMAGE_DIR, FLIPED_NAME);
const JPG_NAME = '178440.jpg';
const JPG_PATH = path.join(IMAGE_DIR, JPG_NAME);
const PNG_NAME = 'sonic.png';
const PNG_PATH = path.join(IMAGE_DIR, PNG_NAME);

const base64String = 'data:image/jpeg;base64,' + new Buffer(fs.readFileSync(JPG_PATH)).toString('base64');
// const base64String2 = 'data:image/png;base64,' + new Buffer(fs.readFileSync(PNG_PATH)).toString('base64');

describe('Tests', function () {
  this.timeout(30000);

  let cleanUpJsDom;

  beforeEach(() => {
    cleanUpJsDom = require('jsdom-global')(null, { resources: 'usable' });
    global.FileReader = FileReader;
    global.File = File;
  });

  it('get File from base64', async () => {
    const file = await getFilefromDataUrl(base64String, JPG_PATH);
    expect(file.type).to.equal('image/jpeg');
    expect(file.size).to.equal(2001612);
    expect(file).to.be.an.instanceof(Blob);
  });

  it('get base64 from file', async () => {
    const file = new File(JPG_PATH);
    const base64 = await getDataUrlFromFile(file);
    expect(base64).to.equal(base64String);
  });

  it('load image', async () => {
    const img = await loadImage(base64String);
    expect(img).to.be.an.instanceof(Image);
    expect(img.src).to.equal(base64String);
  });

  it('draw image in canvas', async () => {
    const img = await loadImage(base64String);
    const canvas = await drawImageInCanvas(img);
    expect(canvas).to.be.an.instanceof(HTMLCanvasElement);
    expect(canvas.width).to.be.a('number');
    expect(canvas.height).to.be.a('number');
    expect(canvas.toDataURL).to.be.a('function');
  });

  it('compress image file', async () => {
    const file = new File(PNG_PATH);

    const maxSizeMB = 1;
    const maxSizeByte = maxSizeMB * 1024 * 1024;

    const compressedFile = await imageCompression(file, maxSizeMB);
    expect(compressedFile.size).to.be.at.most(maxSizeByte);
  });

  it('compress image file', async () => {
    const file = new File(PNG_PATH);

    const maxSizeMB = 0.1;
    const targetFormat = 'image/jpeg';
    const maxSizeByte = maxSizeMB * 1024 * 1024;

    const compressedFile = await imageCompression(file, maxSizeByte, undefined, targetFormat);

    expect(compressedFile.type).to.equal(targetFormat);
  });

  it('rotates image based on exif data', async () => {
    const file = new File(FLIPED_PATH);

    const compressedFile = await imageCompression(file);
    const imgURL = await getDataUrlFromFile(compressedFile);
    const imgElement = await loadImage(imgURL);

    expect(imgElement.width).to.equal(540);
    expect(imgElement.height).to.equal(720);
  });

  afterEach(() => {
    cleanUpJsDom();
  });

});