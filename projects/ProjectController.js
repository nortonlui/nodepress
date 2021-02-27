const express = require('express');
const router = express.Router();
const Project = require('./Project');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const loggedin = require('../modules/loggedIn');



router.get('/projects', (req, res)=>{
    Project.findAll().then((projects)=>{
        const loggedIN = loggedin(req);
        res.render('admin/projects/index', { projects, loggedIN });
    }).catch((e)=>{
        console.log(e);
    })
})

router.get('/projects/manager', adminAuth, (req, res)=>{
    Project.findAll().then((projects)=>{
        const loggedIN = loggedin(req);
        res.render('admin/projects/manager', { projects, loggedIN });
    }).catch((e)=>{
        console.log(e);
    })
})

router.post('/projects/delete', adminAuth, (req, res)=>{
    const { id } = req.body;
    if (!isNaN(id) && id != undefined){
        Project.destroy({
            where: {
                id
            }
        }).then(()=>{
            res.redirect('/admin/projects/manager');
        }).catch((e)=>{
            console.log(e);
        })
    } else {
        res.redirect('/admin/projects/manager');
    }
})

router.get('/projects/new', adminAuth, (req, res)=>{
    const loggedIN = loggedin(req);
    res.render('admin/projects/new', { loggedIN });
})

router.post('/project/saveProject', adminAuth, (req, res)=> {
    const { title, description, linkGit, linkHeroku } = req.body;
    Project.create({
        title,
        slug: slugify(title),
        description,
        linkGit,
        linkHeroku
    }).then(()=>{
        res.redirect('/admin/projects/manager');
    }).catch((e)=>{
        console.log(e);
    })
})

router.get('/projects/edit/:id', adminAuth, (req, res)=>{
    const id = req.params.id;
    Project.findByPk(id).then((project)=>{
        if (project != undefined){
            const loggedIN = loggedin(req);
            res.render('admin/projects/edit', { project, loggedIN });
        } else {
            res.redirect('/admin/projects/manager');
        }
    }).catch((e)=>{
        res.redirect('/admin/projects');
    })
})

router.post('/projects/update', adminAuth, (req, res)=>{
    const { id, title, description, linkGit, linkHeroku } = req.body;
     Project.update({
         id,
         title,
         slug: slugify(title),
         description,
         linkGit,
         linkHeroku
     },
     {
         where: {
             id
         }
     }).then(()=>{
         res.redirect('/admin/projects/manager');
     }).catch((e)=>{
         console.log(e);
     })

})


module.exports = router;