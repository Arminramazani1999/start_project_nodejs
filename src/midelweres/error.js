module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err || "(server error) sonething failed" });
};
