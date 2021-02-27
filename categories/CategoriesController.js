const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const loggedin = require('../modules/loggedIn');

router.get('/categories', adminAuth, (req, res)=>{
    Category.findAll()
    .then((categories)=>{
        const loggedIN = loggedin(req);
        res.render('admin/categories/index', { categories, loggedIN });
    }).catch((e)=>{
        console.log(e);
    })
    
});

router.get('/categories/new', adminAuth, (req, res)=>{
    const loggedIN = loggedin(req);
    res.render('admin/categories/new', { loggedIN });
})

router.post('/categories/saveFormCategories', adminAuth, (req, res)=>{
    const { title } = req.body;
    if (title != undefined){
        Category.create({
            title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories');
        }).catch((e)=>{
            console.log(e);
        })
    }else{
        res.redirect('admin/categories/new');
    }
});

router.post('/categories/editFormCategories', adminAuth, (req,res)=>{
    const { id, title }= req.body
    Category.update({title, slug: slugify(title)}, {
            where: {
                id
        }
    }).then(()=>{
        res.redirect('/admin/categories');
    }).catch((e)=>{
        console.log(e);
    })
});


router.post('/categories/delete', adminAuth, (req, res)=>{
    const id = req.body.id;
    console.log(id);
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id
                }
            }).then(()=>{
                res.redirect('/admin/categories');
            }).catch(()=>{
                console.log(e);
            })

        }else {
            res.redirect('/admin/categories');
        }
    }else {
            res.redirect('/admin/categories');
    }
})

router.get('/categories/edit/:id', adminAuth, (req, res)=>{
    const id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/categories');
    }
    Category.findByPk(id).then((category)=>{
        if (category != undefined){
            const loggedIN = loggedin(req);
           res.render("admin/categories/edit", { category, loggedIN });

        }else {
            res.redirect('/admin/categories');
        }
    }).catch((e)=>{
        res.redirect('/admin/categories');
    })
    
})


module.exports = router;