import Crypto from "../models/crypto.js";
import Email from "../models/email.js";
import Domain from "../models/domain.js";
export default {
  async createCrypto(data) {
    try {
      let result = Crypto.create(data);
      return result;
    } catch (err) {
      return [];
    }
  },
  async createEmail(data) {
    try {
      let result = Email.create(data);
      return result;
    } catch (err) {
      return [];
    }
  },

  async createDomain(data) {
    try {
      let result = Domain.create(data);
      return result;
    } catch (err) {}
  },
  async mergeEmails() {
    try {
      let removeList = Email.aggregate([
        { $group: { _id: { email: "$email" }, doc: { $first: "$$ROOT" } } },
        {
          $replaceRoot: { newRoot: "$doc" },
        },
        {
          $merge: { into: "newEmails" },
        },
      ]).then((res) => {
        console.log(res);
      });
    } catch (err) {
      console.log(err);
    }
  },
};
