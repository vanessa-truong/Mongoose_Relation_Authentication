import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  posts: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Post" }],
});

//Dieser Code definiert eine Methode setPassword für das Benutzer-Schema. Die Methode wird aufgerufen, um das Passwort des Benutzers zu setzen. Hier werden ein zufälliges Salz (this.salt) generiert und das Passwort mit dem Salz gehasht, um den Hash (this.hash) zu erstellen. pbkdf2Sync ist eine Funktion aus dem crypto-Modul, die den Passwort-Hash mit dem PBKDF2-Algorithmus erstellt.

userSchema.methods.setPassword = function (password) {
  // Salt erstellen
  this.salt = crypto.randomBytes(64).toString("hex");
  //Password mit salt hashen
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

//Dieser Code definiert eine weitere Methode verifyPassword, um das eingegebene Passwort mit dem gespeicherten Hash zu überprüfen. Hier wird der Hash des eingegebenen Passworts (hash) mit dem gespeicherten Hash des Benutzers (this.hash) verglichen, um die Gültigkeit des Passworts zu bestätigen.

userSchema.methods.verifyPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  return this.hash === hash;
};

export const User = mongoose.model("User", userSchema);
