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
    test("200: returns array of topics with slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body.topics.length !== 0).toBe(true);

          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(Object.keys(topic).length).toBe(2);
          });
        });
    });
  });
});
