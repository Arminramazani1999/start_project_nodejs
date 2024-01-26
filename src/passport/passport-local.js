const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
require("dotenv").config();

// آیدی یوزر رو رمز گذاری میکند و در مرورگر ذخیره میکند
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// دقیقا برعکس بالا عمل میکند / آیدی رمز گذاری شده را به آیدی اصلی تبدیل میکند و بر میگرداند
passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  if (user) done(null, user);
});

//استراتیژی مون رو برای ثبت نام مینویسیم
passport.use(
  "local.register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, passport, done) => {
      console.log("slaw");
      try {
        // اگر کاربری که قبلا با این ایمیل وجود دارد نباید بتواند دوباره با این ایمیل ثبت نام بکند
        let user = await User.findOne({ email: email }); // email = req.body.email
        if (user) {
          return done({ message: "ا این ایمیل قبلا ثبت نام شده است " });
        }
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8), //پسور را هش میکنیم یعنی به چند تا حروف و عدد رندوم تبدیل میکند
          img: req.body.img,
        });
        await newUser.save();
        console.log(newUser);
        return done(null, newUser, { message: "ثبت نام با موفقیت انجام شد" });
      } catch (error) {
        console.log(error);
        return done(error, false, { message: error });
      }
    }
  )
);

// استراتیژیمون رو برای ورو کردن مینویسیم
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
        // ورودی اول پسوردی هست که کاربر وارد میکند و ورودی دوم پسورد هش شده همون کاربر دی دیتابیس ماست
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
          return done({ message: "اطلاعات شما هماهنگی ندارد" });
        }
        // const token = jwt.sign({_id : user.id}, process.env.JWT_KEY);
        // console.log(token);

        done(null, user);
      } catch (error) {
        return done(error, false, { message: error });
      }
    }
  )
);
