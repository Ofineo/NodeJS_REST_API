const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const AuthController = require("../controllers/auth");
const User = require("../models/user");

const MONGODB_TEST_URI =
  "mongodb+srv://nodeComplete:rYX7GHW1EobK0XFw@node-complete-5hx8z.mongodb.net/test-messages?retryWrites=true&w=majority";

describe("AuthController", () => {
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

  it("Should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "email@email.com",
        password: "tester",
      },
    };
    AuthController.postLogin(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });

  it("should return a response with a valid user status for an existing user", () => {
    const req = {
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    AuthController.getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am new!");
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
