const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
const loggedin = require('../modules/loggedIn');

router.get('/users', adminAuth, (req, res)=>{
    User.findAll().then((users)=>{
        const loggedIN = loggedin(req);
        res.render('admin/users/index', { users, loggedIN })
    }).catch((e)=>{
        console.log(e);
    })
})

router.get('/users/create', adminAuth, (req, res)=>{
    const loggedIN = loggedin(req);
    res.render('admin/users/create', { loggedIN });
})

router.get('/users/reset_password/:id', adminAuth, (req, res)=>{
    
    const id = req.params.id;
    console.log(id);

        User.findByPk(id).then((user)=>{
            const loggedIN = loggedin(req);
            res.render('admin/users/edit', {user, loggedIN})
        }).catch((e)=>{
            console.log(e);
        });

    
})

router.post('/users/updateUser', adminAuth, (req, res)=>{
    const { id, email, password } = req.body;
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(password, salt);
    const now = new Date();

    if (!isNaN(id) && id != undefined){
        User.update({
            email,
            password: hash,
            updatedAt: now
        }, { 
            where: { 
                id 
            }
        }).then(()=>{
            res.redirect('/admin/users');
        }).catch((e)=>{
            console.log(e);
        })
    } else {
        res.redirect('/');
    }

})

router.post('/users/createUser', adminAuth, (req, res)=>{
    const { email, password } = req.body;
    
    User.findOne({
        where: {
            email
        }
    }).then((user)=>{

        if (user == undefined){

            const salt = bcrypt.genSaltSync(8);
            const hash = bcrypt.hashSync(password, salt);

            User.create({
                email, 
                password: hash
            }).then(()=>{
                res.redirect('/admin/users');
            }).catch((e)=>{
                console.log(e);
            });

        } else {
            res.redirect('/admin/users/create');
        }
    }).catch((e)=>{
        console.log(e);
    })
})

router.get('/users/login', (req, res)=>{
    const loggedIN = loggedin(req);
    res.render('admin/users/login', { loggedIN });
});

router.post('/users/delete', adminAuth, (req, res)=>{
    const { id } = req.body;
    if (!isNaN(id) && id != undefined){
        User.destroy({
            where: {
                id
            }
        }).then(()=>{
            res.redirect('/admin/users');
        })
    }else {
        res.redirect('/');
    }
})

router.post('/users/authenticate', (req, res)=>{
    const { email, password } = req.body;

    User.findOne({
        where: {
            email
        }
    }).then((user)=>{
        if (user != undefined){
            const correct = bcrypt.compareSync(password, user.password);
            if (correct){
                req.session.user = {
                    id: user.id,
                    email: user.email,
                }
                res.redirect('/');
            }else{
                res.redirect('/admin/users/login');
            }

        }else {
           res.redirect('/admin/users/login'); 
        }
    }).catch((e)=>{
        console.log(e);
    })
})

router.get('/users/logout', (req, res)=>{
    req.session.user = undefined;
    res.redirect('/');
})



module.exports = router;