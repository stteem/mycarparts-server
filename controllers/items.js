const Items = require('../models/items');




exports.getAllItems = (req, res, next) => {
  Items.find().then(
    (items) => {
      res.status(200).json(items);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
