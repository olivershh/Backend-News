const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/comments/:comment_id", () => {
  describe("GET:", () => {
    test("204: Returns empty object on succesful delete", () => {
      return request(app)
        .delete("/api/comments/5")
        .expect(204)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({});
        });
    });
    test("204: Comment is deleted from db", () => {
      return request(app)
        .delete("/api/comments/5")
        .expect(204)
        .then((response) => {
          return db
            .query("SELECT * FROM comments WHERE comment_id = 5")
            .then((queryData) => {
              expect(queryData.rowCount).toBe(0);
            });
        });
    });
    test("404: Returns error message if comment does not exist", () => {
      return request(app)
        .delete("/api/comments/5000")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "does not exist" });
        });
    });
    test("400: Returns error message if comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/;notvalid")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});
