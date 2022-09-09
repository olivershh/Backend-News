
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
  "PATCH /api/articles/:article_id": {Description: "Updates article votes by article_id and returns updated article", requestSample:{ "inc_votes": 100 }, responseSample: {
	"article": {
		"article_id": 4,
		"title": "Making sense of Redux",
		"topic": "coding",
		"author": "jessjelly",
		"body": "When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).",
		"created_at": "2020-09-11T20:12:00.000Z",
		"votes": 600
	}
}},
  "GET /api/articles/:article_id/comments": {Description: "Returns all comments matching article_id", responseSample: {
	"comments": [
		{
			"comment_id": 63,
			"body": "Est pariatur quis ipsa culpa unde temporibus et accusantium rerum. Consequatur in occaecati aut non similique aut quibusdam. Qui sunt magnam iure blanditiis. Et est non enim. Est ab vero dolor.",
			"author": "jessjelly",
			"votes": -1,
			"created_at": "2020-08-12T22:10:00.000Z"
		}
	]
} },
  "POST /api/articles/:article_id/comments": {Description: "Posts new comment by article_id", requestSample: {"username": "happyamy2016", "body": "Wow that's incredible!"}, responseSample: {
	"comment": {
		"comment_id": 307,
		"body": "Wow that's incredible!",
		"article_id": 4,
		"author": "happyamy2016",
		"votes": 0,
		"created_at": "2022-09-09T08:38:07.429Z"
	}
}},
  "DELETE /api/comments/:comment_id": {Description: "Deletes comment by comment_id", requestSample: responseSample: {}}
};


