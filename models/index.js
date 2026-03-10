const mongoose = require("mongoose");
const Member = require("./member.model");
const Brand = require("./brand.model");
const Perfume = require("./perfume.model");

const db = {}

// Define schema
db.Member = Member;
db.Brand = Brand;
db.Perfume = Perfume;

module.exports = db;