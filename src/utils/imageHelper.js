export function getImageURL(imagePath) {
  return imagePath ? `http://192.168.2.2:8083/storage/${imagePath}` : "";
}
