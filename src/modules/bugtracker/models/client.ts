import { model } from "@medusajs/framework/utils";
import Bug from "./bug";

const Client = model.define("client", {
  id: model.id().primaryKey(),
  contactFirstName: model.text(),
  contactLastName: model.text(),
  companyName: model.text(),
  email: model.text(),
  bugs: model.hasMany(() => Bug, {
    mappedBy: "client",
  })
});

export default Client;