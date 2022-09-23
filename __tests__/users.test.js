const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/users", () => {
  describe("GET:", () => {
    test("200: Response follows correct format {users: [...users]}", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("users", expect.any(Object));
        });
    });
    test("200: Returns array of user objects with correct properties and data types", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body.users.length === 4).toBe(true);

          body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
            expect(Object.keys(user).length).toBe(3);
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET:", () => {
    test("200: Response follows correct format {user: {...user}}", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("user", expect.any(Object));
        });
    });
    test("200: Returns correct user object", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((response) => {
          const { body } = response;
          const expected = {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          };
          expect(body.user).toEqual(expected);
        });
    });
    test("If user does not exist, 'user not found' message is returned", () => {
      return request(app)
        .get("/api/users/oliver")
        .expect(404)
        .then((response) => {
          const { body } = response;
          const expected = { msg: "user not found" };
          expect(body).toEqual(expected);
        });
    });
  });
});
