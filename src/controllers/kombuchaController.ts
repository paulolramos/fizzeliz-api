import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../models/users";
import { Kombucha } from "../models/kombucha";

class KombuchaController {
  // POST; PROTECTED
  public addNewKombucha(req: Request, res: Response): void {
    User.findOne({ email: req.user.email }, (err: any, user: any) => {
      if (err) {
        console.log(err);
        res.json({ error: "Couldn't find user" });
      }

      Kombucha.create(req.body, (err: any, kombucha: any) => {
        if (err) {
          console.log(err);
          res.json({ error: "Failed to create a kombucha" });
        }

        user.kombuchas.push(kombucha);
        user.save((err: any, data: any) => {
          if (err) {
            console.log("Failed to save data", err);
          }
          res.json({ message: "success" });
        });
      });
    });
  }

  public getKombucha(req: Request, res: Response): void {
    // url looks like this: /kombucha/5c6e10b194bff38119f1f82u
    // populate("user") refers to object key in kombuchaSchema
    Kombucha.findById(
      req.params.kombuchaId,
      (err: any, kombucha: mongoose.Document) => {
        if (err) {
          console.log("Failed to get kombucha");
          res.send(err);
        }
        res.status(200).json(kombucha);
      }
    );
  }

  public editKombucha(req: Request, res: Response): void {
    Kombucha.findByIdAndUpdate(
      req.params.kombuchaId,
      req.body,
      (err: any, kombucha: any) => {
        if (err) {
          console.log("Failed to edit kombucha");
          res.send(err);
        }
        res.redirect(`/kombucha/${kombucha._id}`);
      }
    );
  }

  public deleteKombucha(req: Request, res: Response): void {
    Kombucha.findByIdAndDelete(
      req.params.kombuchaId,
      (err: any, kombucha: any) => {
        if (err) {
          console.log("Failed to Delete kombucha");
          res.send(err);
        }
        res.redirect("/kombucha");
      }
    );
  }
}

export default new KombuchaController();
