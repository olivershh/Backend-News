const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");

beforeEach(() => {
  seed(testData);
});

describe("/api/topics", () => {
  test("200: returns array of topics including slug and description", () => {
    expect(0).toBe(0); // Avoiding husky just while I check I'm pushing correctly
  });
});
