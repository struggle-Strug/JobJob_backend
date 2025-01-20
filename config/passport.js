const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../Models/UserModel");
const Admin = require("../Models/AdminModel");
const Customer = require("../Models/CustomerModel");
const passport = require("passport");

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  // Telling Passport where to find the secret
  secretOrKey: process.env.SECRET,
  // TO-DO: Add issuer and audience checks
};
// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    const customer = await Customer.findById(payload.id);
    const admin = await Admin.findById(payload.id);
    if (user || customer || admin) {
      return done(null, user || customer || admin);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);