import QRCode from 'qrcode';

export async function openQrWindow(text) {
  const dataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H', width: 300 });
  const w = window.open('', '_blank', 'width=380,height=420');
  if (!w) return alert('Popup blocked. Allow popups for this site.');
  w.document.write(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;">
  <img src="${dataUrl}" alt="QR"/></body></html>`);
}
