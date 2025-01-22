const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../Models/UserModel");
const Admin = require("../Models/AdminModel");
const Customer = require("../Models/CustomerModel");
const passport = require("passport");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: process.env.SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Attempt to find the user in each role
    const user = await User.findById(payload.id);
    if (user) {
      // If found, attach to `req.user`
      return done(null, { type: "member", data: user });
    }

    const customer = await Customer.findById(payload.id);
    if (customer) {
      // If found, attach to `req.customer`
      return done(null, { type: "customer", data: customer });
    }

    const admin = await Admin.findById(payload.id);
    if (admin) {
      // If found, attach to `req.admin`
      return done(null, { type: "admin", data: admin });
    }

    // If no match, return unauthorized
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);

// Middleware to attach the user role-specific data to req
passport.initialize();

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.type === "user") req.user = user.data;
    if (user.type === "customer") req.customer = user.data;
    if (user.type === "admin") req.admin = user.data;
    next();
  })(req, res, next);
};
