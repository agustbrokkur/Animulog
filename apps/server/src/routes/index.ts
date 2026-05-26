import { type Request, type Response, Router } from "express";
import { animuRouter } from "./animu.ts"

const routes = Router();

routes.use("/animu", animuRouter);

routes.get("/", (_: Request, res: Response) => {
    res.status(200).send("This is the API endpoint");
});

export { routes };