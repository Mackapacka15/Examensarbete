import { Router } from "express";
import { addUser } from "../controllers/userController";

const router = Router();

router.post("/add", (req, res) => {
  addUser(req.body.name, req.body.email, req.body.password)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

router.get("/login", (req, res) => {});
