const AccessControl = require("accesscontrol");

const ac = new AccessControl();
ac.grant("user")
  .createOwn("video")
  .deleteOwn("video")
  .readAny("video")

  .grant("admin")
  .extend("user")
  .updateAny("video", ["title"])
  .deleteAny("video");
