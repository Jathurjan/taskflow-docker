import { validationResult } from 'express-validator';

// Place after express-validator rule arrays; returns 400 with the first message + all field errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const list = errors.array();
  return res.status(400).json({
    success: false,
    message: list[0].msg,
    errors: list.map((e) => ({ field: e.path, message: e.msg })),
  });
};

export default validate;
