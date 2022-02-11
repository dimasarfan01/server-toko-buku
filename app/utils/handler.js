const handler = {
  success(res, data, message) {
    return res.json({ message: message, data: data });
  },
  error(res, message) {
    return res.json({ message: message });
  },
};

module.exports = { handler };
