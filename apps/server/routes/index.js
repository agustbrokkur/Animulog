import express from "express";
import { animuRouter } from "./animu.js"

const routes = express.Router();

routes.use("/animu", animuRouter);

export { routes };