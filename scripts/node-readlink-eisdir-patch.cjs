const fs = require("fs");

function normalizeReadlinkError(error) {
  if (error && error.code === "EISDIR") {
    error.code = "EINVAL";
  }
  return error;
}

const originalReadlink = fs.readlink;
const originalReadlinkSync = fs.readlinkSync;

fs.readlink = function readlink(path, options, callback) {
  if (typeof options === "function") {
    return originalReadlink.call(this, path, (error, result) => {
      options(normalizeReadlinkError(error), result);
    });
  }

  return originalReadlink.call(this, path, options, (error, result) => {
    callback(normalizeReadlinkError(error), result);
  });
};

fs.readlinkSync = function readlinkSync(path, options) {
  try {
    return originalReadlinkSync.call(this, path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

if (fs.promises && fs.promises.readlink) {
  const originalPromisesReadlink = fs.promises.readlink.bind(fs.promises);
  fs.promises.readlink = async function readlink(path, options) {
    try {
      return await originalPromisesReadlink(path, options);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };
}
