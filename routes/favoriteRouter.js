const express = require('express');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');
const cors = require('./cors');
const authenticate = require('../authenticate');
const user = require('../models/user');

const favoriteRouter = express.Router();


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user : req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {    
    
        Favorite.findOne({user: req.user._id}).then(favorite => {
            if(!favorite) {
                Favorite.create({user: req.user, campsites: req.body})
                .then(favorites => {                    
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
            console.log(favorite)

                }).catch(err => next(err));                
            }
            else{
                req.body.forEach((campsite) => {
                    if(!favorite.campsites.includes(campsite._id)){
                        favorite.campsites.push(campsite._id)                        
                    } 

                })
                favorite.save().then(
                    favorite => {
                        res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
                    }
                )
                
                }
        }).catch(err => next(err));
        
        // if(compare === null) {
        //         Favorite.create(req.body).then(favorite => console.log(favorite)).catch(err => next(err));
        //     }
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(`The favorite document of ${req.user.firstname} is deleted` );
    }).catch(err=> next(err))
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req,res) => sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json(`this operation is not supported` );
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
    // Campsite.findOne({_id : req.params._id}).then(
    //     (campsite) => {
    //         if(!campsite){
    //             res.statusCode = 200;
    //             return res.json("This is not a valid campsite");
    //         }
    //         else
    //         return Favorite.findOne({user: req.user._id})
    //     }
    // )
    Favorite.findOne({user: req.user._id}).then(
        favorite => {
            if(!favorite){
                Favorite.create({user: req.user_id, campsites: [req.params.campsiteId]})
                .then(
                    favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }
                ).catch(err => {next(err)})
            } else {
                if(!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId)
                    favorite.save().then(
                        response => {                            
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(response);
                        }
                    )
                }
                else {
                    res.statusCode = 200;
                    res.json("this campsite already exists")
                }
            }
        }
    ).catch(err=> next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id}).then(
        (favorite) => {
            if(!favorite || favorite.campsites.length === 0) {
                res.statusCode = 200;
                res.json("There are no favorites to delete");
            }
            else {
                const compare = favorite.campsites.indexOf(req.params.campsiteId)
                if(compare >= 0){
                    favorite.campsites.splice(compare, 1);
                    
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(`There is no such campsite with id:${req.params.campsiteId} to delete`);
                } 
                favorite.save().then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }).catch(err => next(err))
            }
        }
    ).catch(err => next(err));
})

module.exports = favoriteRouter