const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const loggedin = require('../modules/loggedIn');


router.get('/articles', adminAuth, (req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles)=> {
        const loggedIN = loggedin(req);
        res.render('admin/articles/index', { articles, loggedIN });
    })
   
});

router.post('/articles/delete', adminAuth, (req, res)=>{
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id
                }
            }).then(()=>{
                res.redirect('/admin/articles');
            }).catch(()=>{
                console.log(e);
            })

        }else {
            res.redirect('/admin/articles');
        }
    }else {
            res.redirect('/admin/articles');
    }
})

router.get('/articles/new', adminAuth, (req, res)=>{
    Category.findAll().then((categories)=>{
        const loggedIN = loggedin(req);
        res.render('admin/articles/new', { categories, loggedIN });
    }).catch((e)=>{
        console.log(e);
    })
    
});

router.post('/articles/saveArticle', adminAuth, (req, res)=>{
    const { title, body, categoryId } = req.body;
   
    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId
    }).then(()=>{
        res.redirect('/admin/articles');
    }).catch((e)=>{
        console.log(e);
    })
});

router.get('/articles/edit/:id', adminAuth, (req, res)=>{
    const id = req.params.id;
    Article.findByPk(id).then((article)=>{
        if (article != undefined){
            Category.findAll().then((categories)=>{
                const loggedIN = loggedin(req);
                res.render('admin/articles/edit', { categories, article, loggedIN })
            })
            
        }else{
            res.redirect('/admin/articles')
        }

    }).catch((e)=>{
        res.redirect('/admin/articles');
    })

})

router.post('/articles/update',  adminAuth, (req, res)=>{
    const { id, title, body, categoryId } = req.body;
    Article.update({
        title,
        body,
        categoryId,
        slug: slugify(title)
    }, {
        where: {
            id
        }
    }).then(()=>{
        res.redirect('/admin/articles');
    }).catch(()=>{
        res.redirect('/');
    })

})

router.get('/articles/page/:num',(req, res)=>{
    const page = req.params.num;
    let offset = 0;

    if (isNaN(page)|| page === 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then((articles)=>{

        let next;
        if(offset + 4 >= articles.count){
            next = false;
        } else {
            next = true;
        }

        let results = {
            page: parseInt(page),
            next,
            articles
        }

        Category.findAll().then((categories)=>{
            const loggedIN = loggedin(req);
            res.render('admin/articles/page', { categories, results, loggedIN })
        })

    }).catch(()=>{
        res.redirect('/admin/articles');
    })
});


module.exports = router;