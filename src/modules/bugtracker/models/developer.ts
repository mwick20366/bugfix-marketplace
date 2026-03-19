import { model } from "@medusajs/framework/utils";

const Developer = model.define("developer", {
  id: model.id().primaryKey(),
  firstName: model.text(),
  lastName: model.text(),
  email: model.text(),
});

export default Developer;