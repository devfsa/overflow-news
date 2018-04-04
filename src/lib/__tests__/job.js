/* eslint-env jest, browser */

import { crawlFeed, fetchLatestPosts } from '../job'

describe('crawlFeed', () => {
  // mocking
  jest.mock('request');
  jest.mock('feedparser');

  const requestMock = require('request');
  const fpMock = require('feedparser');

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


describe('fetchLatestPosts', () => {
  // mocking
  jest.mock('../../models/feed', () => ({ find: jest.fn() }));
  jest.mock('bee-queue');
  const feedFind = require('../../models/feed').find;
  const queueMock = require('bee-queue');

  beforeEach(() => {
    queueMock.mockClear();
    fetchLatestPosts();
  });
  afterEach(() => {
    feedFind.mockReset();
  });

  it('Feed.find call', () => {
    expect(feedFind.mock.calls).toMatchSnapshot();
  });

  it('Feed.find handler for error', () => {
    const findHandler = feedFind.mock.calls[0][1];
    const forcedError = new Error('forced');

    findHandler(forcedError);
    expect(queueMock).not.toHaveBeenCalled();
  });

  it('Feed.find handler for sucess', () => {
    const findHandler = feedFind.mock.calls[0][1];
    const bQueue = { createJob: jest.fn(), save: jest.fn() };
    bQueue.createJob.mockReturnThis();
    queueMock.mockImplementation(() => bQueue);

    // array with random length (1~10) filled with random numbers
    const feeds = Array(Math.round(Math.random()*10)).fill().map(Math.random);
    findHandler(undefined, feeds);

    expect(queueMock).toHaveBeenCalledTimes(1);
    expect(queueMock.mock.calls).toMatchSnapshot('queue constructor');

    expect(bQueue.createJob).toHaveBeenCalledTimes(feeds.length);
    feeds.forEach(feed => expect(bQueue.createJob).toHaveBeenCalledWith(feed));
    expect(bQueue.save).toHaveBeenCalledTimes(feeds.length);
    expect(bQueue.save).toHaveBeenCalledWith();
  });
});
