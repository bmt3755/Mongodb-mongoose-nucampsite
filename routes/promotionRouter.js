const express = require('express');
const promotionRouter = express.Router();

promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the promotions to you');
})
.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} \n with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    res.end('Deleting all promotions');
});

promotionRouter.route('/:promotionId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res) => {
    res.end(`Information about the promotion with id: ${req.params.promotionId} is displayed`);
})
.post((req,res)=> {
    res.statusCode = 403;
    res.end(`Post operation is not supported on /promotions/${req.params.promotionId}`);
})
.put((req,res) => {
    res.write(`Updating the promotions information for Id: ${req.params.promotionId}\n`);
    res.end(`Updating the promotion : ${req.body.name} \n with description: ${req.body.description}`);
})
.delete((req,res) => {
    res.end(`Deleting the promotion with Id: ${req.params.promotionId}`);
})
module.exports = promotionRouter;
