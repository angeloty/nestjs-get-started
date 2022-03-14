import { Request, Response } from 'express';
import auth from 'basic-auth';
interface IAuthRequest extends Request {
  auth?: {
    user: string;
    password: string;
  };
}
export const playgroundMiddleware = (
  users: { [username: string]: string },
  path = ['/graphql'],
) => {
  const authorizer = (username, password) => {
    return Object.keys(users).some(
      (name) => username === name && password === users[name],
    );
  };

  return (req: IAuthRequest, resp: Response, next: (...args: any[]) => any) => {
    if (!path.length) {
      return next();
    }
    if (
      path.some((p) => p === req.path) &&
      req.method.toLowerCase() === 'get'
    ) {
      const authentication = auth(req);

      const unauthorized = () => {
        const challengeString = 'Basic';

        resp.set('WWW-Authenticate', challengeString);

        return resp.status(401).json({
          status: 401,
          message: '',
        });
      };

      if (!authentication) return unauthorized();

      req.auth = {
        user: authentication.name,
        password: authentication.pass,
      };

      if (authorizer(authentication.name, authentication.pass)) {
        return next();
      }
      return unauthorized();
    }
    return next();
  };
};
