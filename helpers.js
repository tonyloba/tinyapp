const bcrypt = require('bcrypt');

const generateRandomString = function() {
  const str = Math.random().toString(36).substring(2,8);
  return str;
};

// check if email exists:
const findUserByEmail = (email, userDB) => {
  for (const user in userDB) {
    if (userDB[user].email === email) {
      return userDB[user];
    }
  }
  return false;
};

//// check userID anr returns its specific URLs:
const urlsForUser = function(id, urlDatabase) {
  let urls = {}
  for (const key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      urls[key] = urlDatabase[key]
    }
  }
  return urls;
}

const authenticateUser = (users, email, password) => {
 const tempVal = findUserByEmail(email, users) 
	if (tempVal) {
		// if (users[email].password === password) {
		if (bcrypt.compareSync(password, tempVal.password)) {
			// Email & password match
			return tempVal.id;
      
		}
		// Bad password
		return { user: null, error: "bad password" };
	}
	// Bad email
	return { user: null, error: "bad email" };

}

const emailMatchPass = function(email, password, users) {
  for (const key in users) {
    const hashPass = users[key].password;
    if (bcrypt.compareSync(password, hashPass) && users[key].email === email) {
      return true;
    }
  }
  return false;
}



module.exports = {
  generateRandomString,
  findUserByEmail,
  urlsForUser,
  authenticateUser,
  emailMatchPass
}