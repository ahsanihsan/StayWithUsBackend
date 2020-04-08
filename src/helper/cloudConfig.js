const path = require("path");
const Cloud = require("@google-cloud/storage");
const { Storage } = Cloud;

const configs = require("../configs/config");
const serviceKey = path.join(__dirname, "../configs/blurayKey.json");

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: configs.PROJECT_ID,
});

module.exports = storage;
