import ReactDOM from 'react-dom';

function svgToPng(svg, fill) {
  const height = svg.height.baseVal.value;
  const width = svg.width.baseVal.value;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle =  "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, 0, width, height);

      const xml = new XMLSerializer().serializeToString(svg);
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(xml);
      const img = new Image(width, height);

      img.src = dataUrl;

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const imageData = canvas.toDataURL('image/png', 1.0);
        // console.log(imageData);
        resolve(imageData);
      };

      img.onerror = () => reject();
    } else {
      reject();
    }
  });
}
export async function getPngData(chart, fill) {
  const chartSVG = ReactDOM.findDOMNode(chart)?.children?.[0];

  return await svgToPng(chartSVG, fill);
}
