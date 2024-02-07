type CompressImg = {
  file: File | undefined;
  canvas: HTMLCanvasElement | null;
  imgBefore: HTMLImageElement | null;
  imgAfter: HTMLImageElement | null;
};

export const compressImg = (
  { file, canvas, imgBefore, imgAfter }: CompressImg,
  callback: (imgFileSize: string) => void
) => {
  let imgFileSize = '';
  if (
    file === undefined ||
    canvas === null ||
    imgBefore === null ||
    imgAfter === null
  ) {
    callback(imgFileSize);
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (event) => {
    imgBefore.src = (event.target?.result || '') as string;

    (imgBefore.onload = () => {
      const { width, height } = imgBefore;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        callback(imgFileSize);
        return;
      }
      ctx.drawImage(imgBefore, 0, 0, width, height);
      const webp = ctx.canvas.toDataURL('image/webp', 0.3);

      imgAfter.src = webp;
      const head = 'data:image/webp;base64,';
      imgFileSize = (
        Math.round(((webp.length - head.length) * 3) / 4) / 1000
      ).toFixed(2);
      callback(imgFileSize);
    }),
      (reader.onerror = (error) => console.error(error));
  };
};
