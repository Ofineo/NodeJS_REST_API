const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/is-auth");

describe("Auth middleware", () => {
  it("Shoul throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw("missing headers.");
  });

  it("throw an error if authorization header is only one string", () => {
    const req = {
      get: () => {
        return "this will not work";
      },
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw("jwt malformed");
  });
  it("should throw an error if the token can not be verified", () => {
    const req = {
      get: () => {
        return "Bearer xyz";
      },
    };
    expect(auth.bind(this, req, {}, () => {})).to.throw();
  });
  it("should yield a userId after decoding the token", () => {
    const req = {
      get: () => {
        return "Bearer notavalidtokenbutwhocares";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    auth(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId",'abc');
    jwt.verify.restore();
  });
});
