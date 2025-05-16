import crypto from 'crypto';

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export default generateOTP;
