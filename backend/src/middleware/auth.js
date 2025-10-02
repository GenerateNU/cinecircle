export const fakeAuthMiddleware = (req, res, next) => {
  req.user = {
    id: 'fake-user-id',
    email: 'fakeuser@example.com',
    role: 'tester',
  };
  next();
};