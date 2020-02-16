/* eslint-env node */

import { imaCommonFunction } from "@local-namespace/common-package";
import express from "express";

const expressApp = express();

expressApp.get("/hello", (req, res) => {
  res.send(imaCommonFunction());
});

expressApp.listen(process.env.PORT || 8888);
console.log("goto http://localhost:" + (process.env.PORT || 8888) + "/hello");
