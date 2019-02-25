import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/users";

class UsersController {
  public register(req: Request, res: Response): void {
    User.findOne({ email: req.body.email }, (err: any, user: any) => {
      if (err) return console.log(err);
      if (user) {
        console.log("Email already exists");
        return res.status(404).json({ error: "Email already exists" });
      }

      const newUser = new User(req.body);

      bcrypt.hash(newUser.password, 10, (err: Error, hash: string) => {
        if (err) {
          console.log("Failed to hash password");
          throw err;
        }
        newUser.password = hash;
        newUser.save((err: any, user: any) => {
          if (err) {
            console.log("Failed to save user");
            res.send(err);
          }
          res.json(user);
        });
      });
    });
  }

  public login(req: Request, res: Response): void {
    User.findOne({ email: req.body.email }, (err: any, user: any) => {
      if (!user) {
        console.log("Failed to find user");
        res.status(404).json({ error: "User not found" });
      }

      bcrypt.compare(
        req.body.password,
        user.password,
        (err: any, isMatch: boolean) => {
          if (err) return console.log("Failed to compare passwords");
          if (isMatch) {
            const payload = {
              id: user._id,
              username: user.username
            };
            if (process.env.JWT_SECRET !== undefined) {
              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1hr" },
                (err: any, token: any) => {
                  if (err) return console.log("Failed to create token");
                  res.json({ success: true, token: `Bearer ${token}` });
                }
              );
            }
          } else {
            res.status(400).json({ error: "Incorrect Password" });
          }
        }
      );
    });
  }

  public getUsers(req: Request, res: Response): void {
    User.find({}, (err: any, users) => {
      if (err) {
        console.log("Couldn't get users");
        res.send(err);
      }
      res.json(users);
    });
  }

  public addNewUser(req: Request, res: Response): void {
    const newUser = new User(req.body);

    newUser.save((err: any, user: mongoose.Document) => {
      if (err) {
        console.log("Failed to save user");
        res.send(err);
      }
      res.redirect("/users");
    });
  }

  public getUser(req: Request, res: Response): void {
    User.findById(req.params.userId, (err: any, user: mongoose.Document) => {
      if (err) {
        console.log("Failed to get user");
        res.send(err);
      }
      res.status(200).json(user);
    });
  }

  public editUser(req: Request, res: Response): void {
    User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      (err: any, user: any) => {
        if (err) {
          console.log("Failed to edit user");
          res.send(err);
        }
        res.redirect(`/users/${user._id}`);
      }
    );
  }

  public deleteUser(req: Request, res: Response): void {
    User.findByIdAndDelete(req.params.userId, (err: any, user: any) => {
      if (err) {
        console.log("Failed to delete user");
        res.send(err);
      }
      res.redirect("/users");
    });
  }
}

export default new UsersController();
