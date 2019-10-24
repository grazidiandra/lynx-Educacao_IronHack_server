const UserModel = require("../api/user/userModel");
const InstitutionModel = require("../api/institution/institutionModel");
const { signToken } = require("./authBasic");

exports.signin = (req, res, next) => {
  //* Check if the username and password are correct, if yes send the token
  const token = signToken(req.user._id, req.user.username, req.user.name, req.user.thumbnail, req.user.role);
  res.json({ token });
};

exports.hasRole = role => (req, res, next) => {
  if (req.user.role === role || role === "" || role === undefined) {
    next();
  } else {
    next(new Error("You can't access this route."));
  }
};

exports.signup = (req, res, next) => {
  //* Create institution then create the user
  //* Error if institution exists
  const { name, institution, email, password } = req.body;
  const Institution = new InstitutionModel({ name: institution });
  Institution.save()
    .then(newInstitution => {
      const User = new UserModel({ name, email, password, institution: newInstitution._id });
      User.save()
        .then(newUser => {
          const token = signToken(newUser._id, newUser.email, newUser.name, newUser.thumbnail, newUser.role, newUser.institution);
          res.json({ token });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};