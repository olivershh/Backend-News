const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
const { response } = require("./app");

const endpoints = {
  "GET /api/topics": {Description: "Returns all topics", responseSample: {
	"topics": [
		{
			"slug": "coding",
			"description": "Code is love, code is life"
		}
	]
}},
  "GET /api/users": {Description: "Returns all users", responseSample: {
	"users": [
		{
			"username": "tickle122",
			"name": "Tom Tickle",
			"avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953"
		}
	]
} },
  // inc queries below
  "GET /api/articles": {Description: "Returns all articles", responseSample: {
	"articles": [
		{
			"article_id": 34,
			"title": "The Notorious MSG’s Unlikely Formula For Success",
			"topic": "cooking",
			"author": "grumpy19",
			"created_at": "2020-11-22T11:13:00.000Z",
			"votes": 0,
			"comment_count": 11
		}
	]
}},
  // See 2nd one... below
  "GET /api/articles/:article_id": {Description: "Returns article matching article_id", responseSample: {
	"article": {
		"article_id": 7,
		"title": "Using React Native: One Year Later",
		"topic": "coding",
		"author": "tickle122",
		"body": "When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision.",
		"created_at": "2020-10-18T00:26:00.000Z",
		"votes": 0,
		"comment_count": 8
	}
} },
  "PATCH /api/articles/:article_id": {Description: "Updates article votes by article_id and returns article", requestSample:{ inc_votes: 100 }, responseSample:  },
  "GET /api/articles/:article_id/comments": {Description: "Returns all comments matching article_id", responseSample: },
  "POST /api/articles/:article_id/comments": {Description: "Post new comment by article_id", responseSample: },
  "DELETE /api/comments/:comment_id": {Description: "Delete comment by comment_id", responseSample: }
};


