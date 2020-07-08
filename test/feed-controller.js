const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const FeedController = require("../controllers/feed");
const User = require("../models/user");

const MONGODB_TEST_URI =
  "mongodb+srv://nodeComplete:rYX7GHW1EobK0XFw@node-complete-5hx8z.mongodb.net/test-messages?retryWrites=true&w=majority";

describe("FeedController", () => {
  before((done) => {
    mongoose
      .connect(MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((result) => {
        const user = new User({
          email: "test@email.com",
          password: "abc",
          name: "tester",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then((user) => done());
  });

  it("should add a created post to the posts of the user in the db", (done) => {
    const req = {
      file: {
        path: "this is the path",
      },
      body: {
        title: "test-title",
        content: "test-content",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function() {
        return this;
      },
      json: () => {},
    };

    FeedController.postPost(req, res, () => {})
      .then((user) => {
        expect(user).to.have.property("posts");
        expect(user.posts).to.have.length(1);
        done();
      })
      .catch((err) => console.log(err));
  });
  after((done) => {
    User.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});
