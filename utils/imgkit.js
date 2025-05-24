require('dotenv').config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMG_KIT_PUBLIC,
  privateKey: process.env.IMG_KIT_PRIVATE,
  urlEndpoint:process.env.IMG_KIT_URL_ENDPOINT
});

module.exports = imagekit;