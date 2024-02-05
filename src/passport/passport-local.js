const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  if (user) done(null, user);
});

passport.use(
  "local.register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, passport, done) => {
      try {
        let user = await User.findOne({ email: email }); // email = req.body.email
        if (user) {
          return done({ message: "ا این ایمیل قبلا ثبت نام شده است " });
        }
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          img: req.body.img,
        });
        await newUser.save();
        return done(null, newUser, { message: "ثبت نام با موفقیت انجام شد" });
      } catch (error) {
        return done(error, false, { message: error });
      }
    }
  )
);

passport.use(
  "local.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, passport, done) => {
      try {
        let user = await User.findOne({ email: req.body.email }); // email = req.body.email
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
          return done({ message: "اطلاعات شما هماهنگی ندارد" });
        }
        done(null, user);
      } catch (error) {
        return done(error, false, { message: error });
      }
    }
  )
);
