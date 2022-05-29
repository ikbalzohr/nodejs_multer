const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserList = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    noWa: {
      type: Number,
      required: true,
    },
    alamat: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserList", UserList); //"BlogPost" juga merupakan nama collections
