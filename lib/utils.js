/**
 * getDataUrlFromFile
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function getDataUrlFromFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = (err) => {
			reject(err);
		}
	});
}

/**
 * getFilefromDataUrl
 *
 * @param {string} dataurl
 * @param {string} filename
 * @param {number} lastModified
 * @returns {Promise<File|Blob>}
 */
export function getFilefromDataUrl(dataurl, filename, lastModified = Date.now()) {
	return new Promise((resolve) => {
		const arr = dataurl.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		let file;
		try {
			file = new File([u8arr], filename, { type: mime }); // Edge do not support File constructor
		} catch (e) {
			file = new Blob([u8arr], { type: mime });
			file.name = filename;
			file.lastModified = lastModified;
		}
		resolve(file);
	});
}

/**
 * loadImage
 *
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve(img);
		};
		img.onerror = reject;
		img.src = src;
	});
}

/**
 * drawImageInCanvas
 *
 * @param {HTMLImageElement} img
 * @param {string} [maxWidthOrHeight]
 * @param {Integer} orientation
 * @returns {HTMLCanvasElement}
 */
export function drawImageInCanvas(img, maxWidthOrHeight, orientation) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	let height
	let width

	if (Number.isInteger(maxWidthOrHeight) && (img.width > maxWidthOrHeight || img.height > maxWidthOrHeight)) {
		if (img.width > img.height) {
			width = maxWidthOrHeight;
			height = (img.height / img.width) * maxWidthOrHeight;
		} else {
			width = (img.width / img.height) * maxWidthOrHeight;
			height = maxWidthOrHeight;
		}
	} else {
		width = img.width;
		height = img.height;
	}

	// Set proper canvas dimensions before transform & export.
	if (4 < orientation && orientation < 9) {
		canvas.width = height;
		canvas.height = width;
	} else {
    	canvas.width = width;
    	canvas.height = height;
	}
	
	// Transform context before drawing image.
	switch (orientation) {
		case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
		case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
		case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
		case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
		case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
		case 7: ctx.transform(0, -1, -1, 0, height, width); break;
		case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
		default: break;
	}

	ctx.drawImage(img, 0, 0, width, height);
	
	return canvas;
}

/**
 * addWhiteBackground
 *
 * @param {HTMLImageElement} canvas
 * @returns {HTMLCanvasElement}
 */
export function addWhiteBackground(canvas) {
	let ctx = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;

	ctx.globalCompositeOperation = "destination-over";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, width, height);

	return canvas;
}

/**
 * getExifOrientation
 *
 * @param {File} file
 * @returns {Promise<Int>}
 */
export function getExifOrientation(file) {
	return new Promise(function(resolve, reject) {
		var reader = new FileReader();

		function toArrayBuffer(buffer) {
			const ab = new ArrayBuffer(buffer.length);
			const view = new Uint8Array(ab);
			
			for (let i = 0; i < buffer.length; ++i) {
				view[i] = buffer[i];
			}
			
			return ab;
		}

		reader.onload = function(e) {
			var i = 0;
			var output = e.target.result;
			var view;
			var length;
			var marker;
			var little;
			var tags;
			var arrayBuffer;
			var offset;

			if (output.constructor.name === "Buffer") arrayBuffer = toArrayBuffer(output);
			else arrayBuffer = output;

			view = new DataView(arrayBuffer);
			length = view.byteLength, offset = 2;

			if (view.getUint16(0, false) != 0xFFD8) return resolve(-2);
			
			while (offset < length) {
				if (view.getUint16(offset+2, false) <= 8) return resolve(-1);
				marker = view.getUint16(offset, false);
				offset += 2;
				if (marker == 0xFFE1) {
					if (view.getUint32(offset += 2, false) != 0x45786966) return resolve(-1);

					little = view.getUint16(offset += 6, false) == 0x4949;
					offset += view.getUint32(offset + 4, little);
					tags = view.getUint16(offset, little);
					offset += 2;
					
					for (i; i < tags; i++) {
						if (view.getUint16(offset + (i * 12), little) == 0x0112) {
							return resolve(view.getUint16(offset + (i * 12) + 8, little));
						}
					}
				}

				else if ((marker & 0xFF00) != 0xFF00) break;
				else offset += view.getUint16(offset, false);
			}
			return resolve(-1);
		};

		reader.onerror = function(err) {
			reject(err);
		}
		
		reader.readAsArrayBuffer(file);
	})
}