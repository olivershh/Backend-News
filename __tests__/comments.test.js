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
  describe("PATCH:", () => {
    test("200: comment votes are updated and updated object returned", () => {
      return request(app)
        .patch("/api/comments/4")
        .send({ inc_votes: 150 })
        .expect(200)
        .then((response) => {
          const { body } = response;
          const expected = {
            comment: {
              comment_id: 4,
              body: " I carry a log — yes. Is it funny to you? It is not to me.",
              article_id: 1,
              author: "icellusedkars",
              votes: 50,
              created_at: "2020-02-23T12:01:00.000Z",
            },
          };
          expect(body).toEqual(expected);
        });
    });
    test("404: If comment id does not exist, 'comment not found' message returned.", () => {
      return request(app)
        .patch("/api/comments/123456")
        .send({ inc_votes: 100 })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "comment not found" });
        });
    });
    test("400: If comment id is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/comments/notvalid;")
        .send({ inc_votes: 100 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: If votes is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/comments/4;")
        .send({ inc_votes: "notanumber" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: If patch object is wrong format, bad request error is returned", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ propertyInvalid: 1 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});
