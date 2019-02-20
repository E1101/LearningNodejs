const sinon = require('sinon');

exports.handleGetRequestTest =  (test) =>
{
  let response = {'writeHead' : () => {}, 'end': () => {}};
  let responseMock = sinon.mock(response);

  responseMock.expects('end').once()
       .withArgs('Get action was requested');

  responseMock.expects('writeHead').once()
      .withArgs(200, {
        'Content-Type' : 'text/plain'
      });

    let request = {};
    let requestMock = sinon.mock(request);
    requestMock.method = 'GET';

    let http_module = require('../modules/http-module');
    http_module.handleRequest(requestMock, response);

    responseMock.verify();

    test.done();
};
