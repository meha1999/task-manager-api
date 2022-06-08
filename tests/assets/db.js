const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const _id = mongoose.Types.ObjectId();
const _idTwo = mongoose.Types.ObjectId();

const testUser = {
  _id,
  name: "malai",
  email: "mamali@gmail.com",
  password: "mamali1234",
  tokens: [
    {
      token: jwt.sign({ _id }, process.env.JWT_SECRET),
    },
  ],
};

const testUserTwo = {
  _id: _idTwo,
  name: "halali",
  email: "halali@gmail.com",
  password: "halali1234",
  tokens: [
    {
      token: jwt.sign({ _idTwo }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  done: false,
  owner: _id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  done: true,
  owner: _id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  done: false,
  owner: _idTwo,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(testUser).save();
  await new User(testUserTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  _id,
  testUser,
  _idTwo,
  testUserTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
