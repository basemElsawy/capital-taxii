export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Error converting image to base64'));
    };

    reader.readAsDataURL(file); // Converts the image file to base64
  });
}

export async function imageHandler(event: any) {
  const file = event.target.files[0];
  if (file) {
    try {
      const base64String = await imageToBase64(file);
      return base64String;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    return null;
  }
}
