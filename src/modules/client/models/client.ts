import { model } from "@medusajs/framework/utils";

const Client = model.define("client", {
  id: model.id().primaryKey(),
  contactFirstName: model.text(),
  contactLastName: model.text(),
  companyName: model.text(),
  email: model.text(),
});

export default Client;