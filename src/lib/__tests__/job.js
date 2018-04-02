/* eslint-env jest, browser */

// mocking
jest.mock('request');
import requestMock from 'request';

import { crawlFeed } from '../job'

describe('crawlFeed', () => {
  it('assert request calls', () => {
    const req = { on: jest.fn() };
    req.on.mockReturnValue(req);
    requestMock.mockReturnValue(req);

    const url = `some.url/${Math.random()}`;
    crawlFeed(url);

    expect(requestMock).toHaveBeenCalled();
    expect(requestMock).toHaveBeenCalledWith(url);

    expect(req.on.mock.calls).toMatchSnapshot();
  });
});
