import { createDemoApi } from "./api/demo/create-demo-api";
import { addDemoMessage } from "./components/demo-message";

export default {
  api: createDemoApi(),
  onLoad: () => addDemoMessage()
};
