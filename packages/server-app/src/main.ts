import { imaCommonFunction } from "@local-namespace/common-package";
import express from "express";

console.log(imaCommonFunction());

const expressApp = express();

expressApp.get("hello", (req, res) => {
  res.send(imaCommonFunction());
});
