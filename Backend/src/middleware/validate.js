export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "body";
      errors[field] ??= issue.message;
    }
    return res.status(400).json({
      message: "Validation failed",
      errors,
      error: { message: "Validation failed" },
    });
  }
  req.validatedBody = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "query";
      errors[field] ??= issue.message;
    }
    return res.status(400).json({
      message: "Validation failed",
      errors,
      error: { message: "Validation failed" },
    });
  }
  req.validatedQuery = result.data;
  next();
};
