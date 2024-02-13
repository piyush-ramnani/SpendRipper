const { z } = require("zod");

const createUserInputValidation = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string().min(6),
});

module.exports = {
  zCreateUserInput: createUserInputValidation,
};
