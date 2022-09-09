const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/articles", () => {
  describe("GET:", () => {
    test("200: response follows correct format {articles: [...articles]}", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("articles", expect.any(Array));
        });
    });
    test("200: returns array of article objects with correct properties and data types", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body.articles.length === 12).toBe(true);
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("comment_count", expect.any(Number));
            expect(Object.keys(article).length).toBe(7);
          });
        });
    });
    test("200: Comment count is accurate for articles with 0 comments", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          const noCommentArticles = [4, 10, 2, 11, 12, 7, 8];
          body.articles.forEach((article) => {
            if (noCommentArticles.includes(article.article_id)) {
              expect(article.comment_count).toBe(0);
            }
          });
        });
    });
    test("200: articles are sorted by date in descending order if none specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: articles are sorted in ascending order, if requested.", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("created_at");
        });
    });
    test("200: articles are filtered by topic, if provided", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          const { body } = response;
          body.articles.forEach((article) => {
            expect(body.articles.length).toBe(11);
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: "mitch",
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: returns an empty array when topic exists but no relevant articles exist", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toEqual([]);
        });
    });
    test("404: when topic doesn't exist, {msg: <topic> does not exist} is returned", () => {
      return request(app)
        .get("/api/articles?topic=notatopic")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "topic not found" });
        });
    });
    test("200: articles are sorted by specified colum, if valid.", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("400: returns 'bad request' if sort_by is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=;notvalid")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("200: requests work with multiple parameters", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=desc&topic=mitch")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("votes", { descending: true });
          expect(body.articles.length).toBe(11);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
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
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("article_id", 3);
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", expect.any(Number));
          expect(body.article).toHaveProperty("comment_count", 2);
        });
    });
    test("200: Comment count is accurate", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("comment_count", 2);
        });
    });
    test("200: Comment count is accurate for articles with 0 comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("comment_count", 0);
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
  describe("PATCH:", () => {
    test("200: article votes are updated and updated object returned", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: 100 })
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("article_id", 4);
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", 100);
        });
    });
    test("404: If article number does not exist, 'Article not found' message is returned.", () => {
      return request(app)
        .patch("/api/articles/123456")
        .send({ inc_votes: 100 })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "Article not found" });
        });
    });
    test("400: if article id is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/articles/notvalid;")
        .send({ inc_votes: 100 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: if votes is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/articles/10;")
        .send({ inc_votes: "notanumber" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: if patch object is wrong format, returns bad request error", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ propertyInvalid: 1 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET:", () => {
    test("200: returns all comments for revelant article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual(
            expect.objectContaining({ comments: expect.any(Array) })
          );
          body.comments.forEach((comment) => {
            expect(comment.hasOwnProperty("article_id")).toBe(false);
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("200: returns empty array if no relevant comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          const { body } = response;

          expect(body).toEqual({ comments: [] });
        });
    });
    test("404: If article number does not exist, 'article not found' message is returned.", () => {
      return request(app)
        .get("/api/articles/123456/comments")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "article not found" });
        });
    });
    test("400: If article number is invalid, bad request error is returned.", () => {
      return request(app)
        .get("/api/articles/;nope/comments")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
  describe("POST", () => {
    test.only("201: Returns comment when db is updated", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.comment).toHaveProperty("comment_id", 19);
          expect(body.comment).toHaveProperty("body", "Wow that's so sick!");
          expect(body.comment).toHaveProperty("article_id", 1);
          expect(body.comment).toHaveProperty("author", "butter_bridge");
          expect(body.comment).toHaveProperty("votes", 0);
          expect(body.comment).toHaveProperty("created_at", expect.any(String));
        });
    });
    test.only("201: comment is added to db", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          return db.query("SELECT * FROM comments WHERE comment_id = 19");
        })
        .then((queryData) => {
          const body = queryData.rows[0];
          expect(body).toHaveProperty("comment_id", 19);
          expect(body).toHaveProperty("body", "Wow that's so sick!");
          expect(body).toHaveProperty("article_id", 1);
          expect(body).toHaveProperty("author", "butter_bridge");
          expect(body).toHaveProperty("votes", 0);
          expect(body).toHaveProperty("created_at");
        });
    });
    test("404: When article does not exist, returns 'does not exist'", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "does not exist" });
        });
    });
    test("400: when comment structure is invalid, returns 'bad request'", () => {
      const newComment = {
        theAuthorNotUser: "butter_bridge",
        mainBit: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("404: When user does not exist, returns 'does not exist'", () => {
      const newComment = {
        username: "margarine_bridge",
        body: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "does not exist" });
        });
    });
    test("400: when article number is invalid, returns 'bad request'", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles/notvalid/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
  });
});