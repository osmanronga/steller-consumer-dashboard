// utils/fileType.js
export const getFileType = (url) => {
    if (!url) return null;
  
    // Remove query parameters and hash from the URL
    const cleanUrl = url.split('?')[0].split('#')[0];
  
    // Extract the file extension
    const extension = cleanUrl.split('.').pop().toLowerCase();
  
    // Check if it's a PDF
    if (extension === 'pdf' || cleanUrl.includes('.pdf')) {
      return 'pdf';
    }
  
    // Check if it's an image
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    if (imageExtensions.includes(extension) || imageExtensions.some(ext => cleanUrl.includes(`.${ext}`))) {
      return 'image';
    }
  
    // Default to unknown type
    return null;
  };