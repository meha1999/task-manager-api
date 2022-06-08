const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { _id, setupDatabase, testUser } = require("./assets/db");

beforeEach(setupDatabase);

test("Should register user", async () => {
  const res = await request(app)
    .post("/users")
    .send({
      name: "halali",
      email: "adaddads@gmail.com",
      password: "sssssssssadfdrgrdg55",
    })
    .expect(201);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  expect(res.body).toMatchObject({
    user: {
      name: "halali",
      email: "adaddads@gmail.com",
    },
    token: user.tokens[0].token,
  });
});

test("Should login", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(200);
  const user = await User.findById(_id);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not login with fake credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: "dsdfefsdfsdfsfsdf",
    })
    .expect(400);
});

test("Shoud get user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Shoud not get user profile", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Shoud delete user profile", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(_id);
  expect(user).toBeNull();
});

test("Shoud not delete user profile", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .attach("avatar", "tests/assets/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(_id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields ", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({
      name: "hapal",
    })
    .expect(200);
  const user = await User.findById(_id);
  expect(user.name).toEqual("hapal");
});

test("Should not update invalid user fields ", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({
      city: "mashhad",
    })
    .expect(400);
});
