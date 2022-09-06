const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: response follows correct format {topics: [...topics]}", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.hasOwnProperty("topics")).toBe(true);
        });
    });
    test("200: returns array of topic objects with correct properties and data types", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body.topics.length === 3).toBe(true);

          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(Object.keys(topic).length).toBe(2);
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET:", () => {
    test("200: Response follows correct format {article: {...article}}", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("article", expect.any(Object));
        });
    });
    test("200: Article has all properties with correct data type", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("article_id", 4);
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", expect.any(Number));
        });
    });
    test("404: If article number does not exist, 'Article not found' message is returned.", () => {
      return request(app)
        .get("/api/articles/123456")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "Article not found" });
        });
    });
    test("400: If article number is invalid, bad request error is returned.", () => {
      return request(app)
        .get("/api/articles/;nope")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET:", () => {
    test("200: response follows correct format {users: [...users]}", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("users", expect.any(Object));
        });
    });
    test("200: returns array of user objects with correct properties and data types", () => {
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
