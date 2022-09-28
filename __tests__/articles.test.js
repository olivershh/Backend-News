const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/articles", () => {
  describe("GET:", () => {
    test("200: Response follows correct format {articles: [...articles]}", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveProperty("articles", expect.any(Array));
        });
    });
    test("200: Returns array of article objects", () => {
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
    test("200: Articles sorted by date descending (default)", () => {
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
    test("200: Articles sorted ascending if requested.", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("created_at");
        });
    });
    test("200: Articles filtered by topic, if provided", () => {
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
    test("200: Returns empty array when topic exists but no matching articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toEqual([]);
        });
    });
    test("404: {msg: <topic> does not exist} when topic doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=notatopic")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "topic not found" });
        });
    });
    test("200: Articles sorted by column, if valid.", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("400: Returns 'bad request' if sort_by is not valid", () => {
      return request(app)
        .get("/api/articles?sort_by=;notvalid")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("200: Requests work with multiple parameters", () => {
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
  describe("POST:", () => {
    test("201: Returns article with comment count when db is updated", () => {
      const newArticle = {
        author: "rogersop",
        title: "Why pen and paper is the new javascript",
        body: "In my opinion, anuything you can do with JS you can do with the classic pen and paper and a few years time",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.article).toHaveProperty("author", "rogersop");
          expect(body.article).toHaveProperty(
            "title",
            "Why pen and paper is the new javascript"
          );
          expect(body.article).toHaveProperty(
            "body",
            "In my opinion, anuything you can do with JS you can do with the classic pen and paper and a few years time"
          );
          expect(body.article).toHaveProperty("topic", "cats");
          expect(body.article).toHaveProperty("article_id", 13);
          expect(body.article).toHaveProperty("votes", 0);
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("comment_count", 0);
        });
    });
    test("201: Article is added to db", () => {
      const newArticle = {
        author: "rogersop",
        title: "Why pen and paper is the new javascript",
        body: "In my opinion, anuything you can do with JS you can do with the classic pen and paper and a few years time",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles/")
        .send(newArticle)
        .expect(201)
        .then((response) => {
          return db.query("SELECT * FROM articles WHERE article_id = 13");
        })
        .then((queryData) => {
          const body = queryData.rows[0];
          expect(body).toHaveProperty("author", "rogersop");
          expect(body).toHaveProperty(
            "title",
            "Why pen and paper is the new javascript"
          );
          expect(body).toHaveProperty(
            "body",
            "In my opinion, anuything you can do with JS you can do with the classic pen and paper and a few years time"
          );
          expect(body).toHaveProperty("topic", "cats");
          expect(body).toHaveProperty("article_id", 13);
          expect(body).toHaveProperty("votes", 0);
          expect(body).toHaveProperty("created_at");
        });
    });
    test("400: When article structure is invalid, returns 'bad request'", () => {
      const newArticle = {
        notavalidkey: "ddd",
        mainBit: "Wow that's so sick!",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: When data is invalid, returns bad request", () => {
      const newArticle = {
        author: "rogersop",
        title: "Why pen and paper is the new javascript",
        body: null,
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: When author does not exist, returns 'author does not exist'", () => {
      const newArticle = {
        author: "JonathonSnow",
        title: "Why pen and paper is the new javascript",
        body: "Your level of knowledge very basic, Jonathon Snow.",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "author does not exist" });
        });
    });
    test("400: When topic does not exist, returns 'topic does not exist'", () => {
      const newArticle = {
        author: "rogersop",
        title: "Why pen and paper is the new javascript",
        body: "lorem ipsum",
        topic: "game of thrones",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "topic does not exist" });
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
    test("200: Returns correct article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const { body } = response;
          const expected = {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            comment_count: 2,
          };
          expect(body.article).toEqual(expected);
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
    test("404: If article number does not exist, 'article not found' message is returned.", () => {
      return request(app)
        .get("/api/articles/123456")
        .expect(404)
        .then((response) => {
          const { body } = response;
          const expected = { msg: "article not found" };
          expect(body).toEqual(expected);
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
    test("200: Article votes are updated and updated object returned", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: 100 })
        .expect(200)
        .then((response) => {
          const { body } = response;
          const expected = {
            article: {
              article_id: 4,
              title: "Student SUES Mitch!",
              topic: "mitch",
              author: "rogersop",
              body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
              created_at: "2020-05-06T01:14:00.000Z",
              votes: 100,
            },
          };
          expect(body).toEqual(expected);
        });
    });
    test("404: If article id does not exist, 'article not found' message returned.", () => {
      return request(app)
        .patch("/api/articles/123456")
        .send({ inc_votes: 100 })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "article not found" });
        });
    });
    test("400: If article id is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/articles/notvalid;")
        .send({ inc_votes: 100 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: If votes is invalid, bad request error is returned", () => {
      return request(app)
        .patch("/api/articles/10;")
        .send({ inc_votes: "notanumber" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ msg: "bad request" });
        });
    });
    test("400: If patch object is wrong format, bad request error is returned", () => {
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
    test("200: Returns all comments for revelant article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { body } = response;
          console.log(body);
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
    test("200: Returns empty array if no relevant comments", () => {
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
    test("201: Returns comment when db is updated", () => {
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
    test("201: Comment is added to db", () => {
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
    test("400: When comment structure is invalid, returns 'bad request'", () => {
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
    test("404: When article does not exist, returns 'article_id does not exist'", () => {
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
          expect(body).toEqual({ msg: "article_id does not exist" });
        });
    });
    test("404: When author does not exist, returns 'author does not exist'", () => {
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
          expect(body).toEqual({ msg: "author does not exist" });
        });
    });
    test("400: When article number is invalid, returns 'bad request'", () => {
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
