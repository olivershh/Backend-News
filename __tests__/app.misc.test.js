const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/", () => {
  describe("GET", () => {
    test("200: returns object of valid endpoints", () => {
      return request(app)
        .get("/")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.hasOwnProperty("endpoints")).toBe(true);
        });
    });
  });
});
