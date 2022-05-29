const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Users = require("../models/users");

exports.createUsers = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Input Value Tidak Sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Gambar harus di Upload");
    err.errorStatus = 422;
    throw err;
  }

  const nama = req.body.nama;
  const noWa = req.body.noWa;
  const kota = req.body.alamat.kota;
  const kelurahan = req.body.alamat.kelurahan;
  const image = req.file.path;

  const Posting = new Users({
    nama: nama,
    noWa: noWa,
    alamat: {
      kota: kota,
      kelurahan: kelurahan,
    },
    image: image,
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create User List Success",
        data: result,
      });
    })
    .catch((err) => {
      console.log("err :", err);
    });
};

exports.updateUsers = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Input Value Tidak Sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }
  if (req.params.userId.length !== 24) {
    const err = new Error(`id: ${req.params.userId} kurang dari 24 karakter`);
    err.errorStatus = 422;
    throw err;
  }

  if (!req.file) {
    const nama = req.body.nama;
    const noWa = req.body.noWa;
    const kota = req.body.alamat.kota;
    const kelurahan = req.body.alamat.kelurahan;
    const userId = req.params.userId;

    Users.findById(userId)
      .then((user) => {
        if (!user) {
          const err = new Error(`Data User dengan id: ${userId} tidak ditemukan`);
          err.errorStatus = 404;
          throw err;
        }

        user.nama = nama;
        user.noWa = noWa;
        user.alamat.kota = kota;
        user.alamat.kelurahan = kelurahan;

        return user.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "data telah diperbaharui",
          data: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    const nama = req.body.nama;
    const noWa = req.body.noWa;
    const kota = req.body.alamat.kota;
    const kelurahan = req.body.alamat.kelurahan;
    const image = req.file.path;
    const userId = req.params.userId;

    Users.findById(userId)
      .then((user) => {
        if (!user) {
          const err = new Error("Data tidak ditemukan");
          err.errorStatus = 404;
          throw err;
        }

        removeImage(user.image);

        user.nama = nama;
        user.noWa = noWa;
        user.alamat.kota = kota;
        user.alamat.kelurahan = kelurahan;
        user.image = image;

        return user.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "data telah diperbaharui",
          data: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getAllUsers = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalItems;

  Users.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Users.find()
        .skip(parseInt(currentPage - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({
        message: "Data Users Berhasil di Panggil",
        data: result,
        total_data: totalItems,
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersById = (req, res, next) => {
  const userId = req.params.userId;

  Users.findById(userId)
    .then((result) => {
      if (!result) {
        const error = new Error("User Tidak Ditemukan");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: `Data User dengan id: ${userId} Ditemukan`,
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

//remove file pada system
const removeImage = (imagePath) => {
  const filePath = path.join(__dirname, "..", imagePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.deleteUsers = (req, res, next) => {
  const userId = req.params.userId;
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("Data tidak ditemukan");
        err.errorStatus = 404;
        throw err;
      }

      removeImage(user.image);
      return Users.findByIdAndRemove(userId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Hapus User Berhasil",
        data: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};
