const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  setupDatabase,
  testUser,
  _idTwo,
  testUserTwo,
  taskOne,
  taskTwo,
  taskThree,
} = require("./assets/db");

beforeEach(setupDatabase);

test("Should create a post", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({
      description: "la la la laaaaaaaala",
    })
    .expect(201);
  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.done).toEqual(false);
});

test("Should  get user tasks", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .expect(200);
  expect(res.body.length).toEqual(2);
});

test("Should  delete other user task", async () => {
  request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete other user task", async () => {
  request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${testUserTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
