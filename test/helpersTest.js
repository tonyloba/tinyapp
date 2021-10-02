const { assert } = require('chai');
const bcrypt = require('bcrypt');
const {
  generateRandomString,
  findUserByEmail,
  urlsForUser,
  authenticateUser,
  emailMatchPass
} = require('../helpers')


const testUrlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "sdfsdf"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "s34r3f"
  },
  "bnun15": {
    longURL: "http://www.tweeter.com",
    userID: "wrg5df"
  }
};

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

}

// testing for email persistence:
describe('findUserByEmail', function() {
  it('should return TRUE if  email matches', function() {
    const actual = findUserByEmail("user@example.com", testUsers)
    const expected = true;
    assert.strictEqual(actual, expected)
  });
});

describe('findUserByEmail', function() {
  it("should return FALSE if input email doesn't match", function() {
    const actual = findUserByEmail("nonexists@example.com", testUsers)
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});


// testing for user persistence:

describe('authenticateUser', function() {
  it("should return user ID if input email-correct && password-correct", function() {
    const actual = authenticateUser("user@example.com", "purple-monkey-dinosaur", testUsers);
    const expected = "userRandomID";
    assert.strictEqual(actual, expected)
  });
});
describe('authenticateUser', function() {
  it("should return FALSE if input email-wrong && password- wrong", function() {
    const actual = authenticateUser("user@f3434.com", "345345-dinosaur", testUsers);
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});
describe('authenticateUser', function() {
  it("should return FALSE if email-correct && password-wrong", function() {
    const actual = authenticateUser("user@example.com", "345345-dinosaur", testUsers);
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});
describe('authenticateUser', function() {
  it("should return FALSE if email-wrong && password-correct", function() {
    const actual = authenticateUser("user@f3434343.com", "purple-monkey-dinosaur", testUsers);
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});


//check for crypted paswword && email:

describe('emailMatchPass', function() {
  it("should return TRUE if input password === crypted email", function() {
    const actual = emailMatchPass("user@example.com", "purple-monkey-dinosaur", testUsers)
    const expectedOutput = true;
    assert.strictEqual(actual, expected)
  });
});
describe('emailMatchPass', function() {
  it("should return FALSE if input password !== crypted email", function() {
    const actual = emailMatchPass("user@example.com", "54456-dinosaur", testUsers)
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});
describe('emailMatchPass', function() {
  it("should return FALSE if input email !== email from DB", function() {
    const actual = emailMatchPass("user@23423.com", "purple-monkey-dinosaur", testUsers)
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});
describe('emailMatchPass', function() {
  it("should return FALSE if input email-wrong && password-wrong", function() {
    const actual = emailMatchPass("user@23434.com", "234344-dinosaur", testUsers)
    const expected = false;
    assert.strictEqual(actual, expected)
  });
});


// test for pair URLS-UserID:

describe('urlsForUser', function() {
  it("should return TRUE  if input UserID === UserID from DB", function() {
    const actual = urlsForUser("userRandomID", testUrlDatabase);
    const expected = {"b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" }}
    assert.deepEqual(actual, expected)
  });
});
describe('urlsForUser', function() {
  it("should return FALSE  if input UserID === UserID from DB", function() {
    const actual = urlsForUser("use4234234andomID", testUrlDatabase);
    const expected = {};
    assert.deepEqual(actual, expected)
  });
});