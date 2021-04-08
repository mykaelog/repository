import request from 'supertest';
import express from 'express';
import createServer from '../index';


describe('CreateServer Function', () => {
  it('should be a function', () => {
    const actual = typeof createServer;
    const expected = 'function';

    expect(actual).toBe(expected);
  });
  it('should been called', async () => {
    const actual = jest.fn();

    actual(await createServer({}));
    expect(actual).toHaveBeenCalled();
  });
});

describe('CreateServer default Middlewares', () => {
  let server;
  const responseMsg = {msg: {type: 'ok'}};
  const createMiddlewareJSON = async (req, res, next) => {
    if (req.method === 'POST') {
      return res.status(200).json(req.body);
    }
    next();
  };
  const createMiddlewareURLEncoded = async (req, res, next) => {
    if (req.method === 'GET') {
      return res.status(200).json(req.query);
    }
  };
  beforeEach(async () => {
    server = await createServer({});
    server.use(createMiddlewareJSON);
    server.use(createMiddlewareURLEncoded);
  });
  it('should have been loaded bodyParser middleware', async () => {
    process.env.NODE_ENV = 'production'; // Coverage get line for morgan config
    const response = await request(server).post('/').send(responseMsg);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseMsg);
    expect(response.headers).toEqual(
      expect.objectContaining({
        'content-type': 'application/json; charset=utf-8',
      }),
    );
  });
  it('should have been loaded responseTime middleware', async () => {
    const response = await request(server).post('/');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'x-response-time': expect.any(String),
      }),
    );
  });
  it('should have been loaded helmet middleware', async () => {
    const response = await request(server).post('/');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'x-frame-options': expect.any(String),
      }),
    );
  });
  it('should have been loaded urlencoded middleware', async () => {
    const response = await request(server).get('/?msg[type]=ok');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseMsg);
  });
});

describe('createServer should load options', () => {
  it('should load a route', async () => {
    const router = new express.Router();
    router.route('/test')
      .get((req, res) => res.json('Hello from route'));

    const server = await createServer({
      routers: [router],
    });
    const response = await request(server).get('/test');

    expect(response.body).toBe('Hello from route');
  });
  it('should load a route with a prefix given', async () => {
    const router = new express.Router();
    router.get('/test', async (req, res) => (res.json('Hello from route')));

    const server = await createServer({
      routers: [router],
      prefix: '/api',
    });
    const response = await request(server).get('/api/test/');

    expect(response.body).toBe('Hello from route');
  });
  it('should load custom middleware', async () => {
    const middleware = async (req, res, next) => {
      res.status(204).send();
    };

    const server = await createServer({
      middlewares: [middleware],
    });
    const response = await request(server).get('');

    expect(response.status).toEqual(204);
  });
});
