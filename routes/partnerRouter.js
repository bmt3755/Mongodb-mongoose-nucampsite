const express = require('express');
const partnerRouter = express.Router();

partnerRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the partners to you');
})
.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} \n with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    res.end('Deleting all partners');
});

partnerRouter.route('/:partnerId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res) => {
    res.end(`Information about the partner with id: ${req.params.partnerId} is displayed`);
})
.post((req,res)=> {
    res.statusCode = 403;
    res.end(`Post operation is not supported on /partners/${req.params.partnerId}`);
})
.put((req,res) => {
    res.write(`Updating the partners information for Id: ${req.params.partnerId}\n`);
    res.end(`Updating the partner : ${req.body.name} \n with description: ${req.body.description}`);
})
.delete((req,res) => {
    res.end(`Deleting the partner with Id: ${req.params.partnerId}`);
})
module.exports = partnerRouter;