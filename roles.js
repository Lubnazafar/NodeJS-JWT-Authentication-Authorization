const AccessControl = require("accesscontrol");
const accesscontrol = new AccessControl();

exports.roles = (function() {
  accesscontrol.grant("user")
    .readOwn("profile")
    .updateOwn("profile")

    accesscontrol.grant("supervisor")
    .extend("user")
    .readAny("profile")

    accesscontrol.grant("admin")
    .extend("user")
    .extend("supervisor")
    .updateAny("profile")
    .deleteAny("profile")

  return accesscontrol;
})();
