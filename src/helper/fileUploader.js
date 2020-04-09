const configs = require("../configs/config");
const gc = require("./cloudConfig");
const bucket = gc.bucket(configs.BUCKET_NAME);

module.exports = uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `${configs.BUCKET_URL}${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
};

// module.exports = deleteImage = (filename) =>
//   new Promise((resolve, reject) => {
//     bucket
//       .file(filename)
//       .delete()
//       .then(() => {
//         resolve(true);
//       })
//       .catch(() => {
//         reject(false);
//       });
//   });
