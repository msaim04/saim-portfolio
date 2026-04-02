import jwt from 'jsonwebtoken';

export const createToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at
});
