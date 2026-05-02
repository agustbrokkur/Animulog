import express from "express";
import { animuRouter } from "./animu.ts"

const routes = express.Router();

routes.use("/animu", animuRouter);

export { routes };