const { z } = require('zod');

const registerSchema = z.object({
  email: z.string()
    .email()
    .min(5)
    .max(255)
    .transform(email => email.toLowerCase()),
  password: z.string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  name: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s]*$/),
  role: z.enum(['RIDER', 'DRIVER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
}; 