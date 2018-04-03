/* eslint-env jest, browser */

// mocking
jest.mock('request');
jest.mock('feedparser');
import requestMock from 'request';
import fpMock from 'feedparser';

import { crawlFeed } from '../job'

describe('crawlFeed', () => {
  beforeEach(() => {
    fpMock.mockClear();
  });

  it('request calls', () => {
    const req = { on: jest.fn() };
    req.on.mockReturnValue(req);
    requestMock.mockReturnValue(req);

    const url = `some.url/${Math.random()}`;
    crawlFeed(url);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith(url);

    expect(req.on.mock.calls).toMatchSnapshot();
  });

  it('request error handler', () => {
    const req = { on: jest.fn() };
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);

    const callback = jest.fn();
    const url = `some.url/${Math.random()}`;
    crawlFeed(url, callback);

    const forcedError = new Error('forcing');
    const handler = req.on.mock.calls.filter(call => call[0] === 'error')[0][1];
    handler(forcedError);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(forcedError);
  });

  it('request response handler', () => {
    const fp = { on: jest.fn() };
    const req = { on: jest.fn(), pipe: jest.fn() };
    fp.on.mockReturnThis();
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);
    fpMock.mockImplementation(() => fp);

    const url = `some.url/${Math.random()}`;
    crawlFeed(url);

    const handler = req.on.mock.calls.filter(call => call[0] === 'response')[0][1];
    handler.bind(req)();

    expect(req.pipe).toHaveBeenCalledTimes(1);
    expect(req.pipe).toHaveBeenCalledWith(fp);

    expect(fp.on.mock.calls).toMatchSnapshot();
  });

  it('feedparser error handler', () => {
    const fp = { on: jest.fn() };
    const req = { on: jest.fn(), pipe: jest.fn() };
    fp.on.mockReturnThis();
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);
    fpMock.mockImplementation(() => fp);

    const callback = jest.fn();
    const url = `some.url/${Math.random()}`;
    crawlFeed(url, callback);

    const reqHandler = req.on.mock.calls.filter(call => call[0] === 'response')[0][1];
    reqHandler.bind(req)();

    const forcedError = new Error('forcing');
    const fpHandler = fp.on.mock.calls.filter(call => call[0] === 'error')[0][1];
    fpHandler(forcedError);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(forcedError);
  });

  it('feedparser success handler', () => {
    const fp = { on: jest.fn() };
    const req = { on: jest.fn(), pipe: jest.fn() };
    fp.on.mockReturnThis();
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);
    fpMock.mockImplementation(() => fp);

    const callback = jest.fn();
    const url = `some.url/${Math.random()}`;
    crawlFeed(url, callback);

    const reqHandler = req.on.mock.calls.filter(call => call[0] === 'response')[0][1];
    reqHandler.bind(req)();

    const [fpReadable, fpEnd] = fp.on.mock.calls
        .filter(call => call[0] !== 'error')
        .map(params => params[1]);

    const post = Math.random();
    const fakeReadable = { read: jest.fn() };
    fakeReadable.read.mockReturnValueOnce(post);
    fakeReadable.read.mockReturnValueOnce(null);
    fpReadable.bind(fakeReadable)();
    fpEnd();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, [post]);
  });
});
