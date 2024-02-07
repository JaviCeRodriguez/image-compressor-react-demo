import { useRef, useState } from 'react';
import { compressImg } from './compressImg.ts';
import './App.css';

function App() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgBeforeRef = useRef<HTMLImageElement>(null);
  const imgAfterRef = useRef<HTMLImageElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState({
    origin: 0,
    compressed: 0,
  });

  const handleLoadImage = () => {
    inputFileRef.current?.click();
  };

  const handleOnChange = () => {
    const file = inputFileRef.current?.files?.[0];
    const urlImg = URL.createObjectURL((inputFileRef.current?.files || [])[0]);
    setPreview(urlImg);

    compressImg(
      {
        file,
        canvas: canvasRef.current,
        imgBefore: imgBeforeRef.current,
        imgAfter: imgAfterRef.current,
      },
      (imgFileSize) => {
        setSizes({
          ...sizes,
          origin: file?.size || 0,
          compressed: Number(imgFileSize),
        });
      }
    );
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h1>Image compressor</h1>

      <img src="" ref={imgBeforeRef} id="before" style={{ display: 'none' }} />
      <img src="" ref={imgAfterRef} id="after" style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <input
          type="file"
          name="upload-image"
          id="upload-image"
          required
          ref={inputFileRef}
          onChange={handleOnChange}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={handleLoadImage}>
          Load
        </button>
      </div>

      <div>
        <p>
          <b>Original</b>: ~{Math.ceil(sizes.origin / 1000)} KB
        </p>
        <p>
          <b>Compressed</b>: ~{sizes.compressed} KB
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {preview ? (
          <figure>
            <img
              src={preview}
              alt="preview"
              style={{
                border: '1px solid #646cff',
                width: '400px',
              }}
            />
          </figure>
        ) : null}
        {imgAfterRef.current ? (
          <figure>
            <img
              src={imgAfterRef.current.src}
              alt="preview"
              style={{
                border: '1px solid #646cff',
                width: '400px',
              }}
            />
          </figure>
        ) : null}
      </div>
    </div>
  );
}

export default App;
