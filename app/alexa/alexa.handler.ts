import restify = require('restify');
let verifier = require('alexa-verifier');

// could be use with server.use()

export default (req: restify.Request, res: restify.Response, next: restify.Next) => {
    let certUrl: string = req.headers.signaturecertchainurl;
    let signature: string = req.headers.signature;
    let body: string = JSON.stringify(req.body);
    
    verifier(certUrl, signature, body, (error: any) => {
      if (error) {
        console.error('error validating the alexa cert:', error);
        res.json(401, { status: 'failure', reason: error });
      } else {
        console.log('Alexa cert validated.');
        next();
      }
    });
}
