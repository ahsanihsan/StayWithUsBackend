const configs = require("../configs/config");
const gc = require("./cloudConfig");
const bucket = gc.bucket("blurayshop");

module.exports = uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    console.log("******");
    console.log(blobStream);
    console.log("******");
    blobStream
      .on("finish", () => {
        const publicUrl = `${"https://storage.googleapis.com/"}${bucket.name}/${
          blob.name
        }`;
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
