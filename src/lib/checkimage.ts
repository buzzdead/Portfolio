/* import Jimp from 'jimp'


export const isPictureClear = async (imageBuffer: string) => {
  
  const image = (await Jimp.read(imageBuffer)).greyscale();
  const grayImage = image.clone()

  // Calculate the Laplacian variance
  let laplacianVar = 0;
  for (let y = 0; y < grayImage.bitmap.height; y++) {
    for (let x = 0; x < grayImage.bitmap.width; x++) {
      const pixel = Jimp.intToRGBA(grayImage.getPixelColor(x, y)).r; // Get the grayscale value
      laplacianVar += pixel * pixel;
    }
  }
  laplacianVar /= grayImage.bitmap.width * grayImage.bitmap.height;

  // Define a threshold for clarity
  const threshold = 100.0;

  return laplacianVar > threshold;
};

 */