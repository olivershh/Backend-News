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
