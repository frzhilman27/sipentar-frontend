/**
 * Compresses an image file to ensure its Base64 payload size is well below Vercel's 4.5MB limit.
 * Downscales retaining aspect ratio and compresses JPEG quality.
 * @param {File} file - The original image file from the input
 * @param {number} maxWidth - Maximum width (default 800)
 * @param {number} maxHeight - Maximum height (default 800)
 * @param {number} quality - JPEG compression quality 0.0 to 1.0 (default 0.7)
 * @returns {Promise<string>} Base64 data URL
 */
export const compressImageToBase64 = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height *= maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width *= maxHeight / height));
                        height = maxHeight;
                    }
                }

                // Create canvas and draw image
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                // Fill white background for transparent PNGs converted to JPEG
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0, width, height);

                // Export as JPEG Base64
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
