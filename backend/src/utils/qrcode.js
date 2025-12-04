const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrData = {
      merchant: 'Simple Online Shop',
      amount: data.amount,
      transaction_id: data.transaction_id || Date.now(),
      timestamp: new Date().toISOString()
    };

    const qr_code = await QRCode.toDataURL(JSON.stringify(qrData));
    return qr_code;
  } catch (error) {
    throw new Error('Failed to generate QR code: ' + error.message);
  }
};

module.exports = {
  generateQRCode
};
