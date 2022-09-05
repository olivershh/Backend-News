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
    test("200: returns array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body.topics).not.toEqual([]);

          const correctKeys = body.topics.every((topic) => {
            return (
              topic.hasOwnProperty("slug") &&
              topic.hasOwnProperty("description")
            );
          });
          expect(correctKeys).toBe(true);
        });
    });
  });
});
