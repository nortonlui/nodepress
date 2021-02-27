const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const loggedin = require('./modules/loggedIn');
const ownedBlog = 'Norton Luiz';
const xss = require('xss-clean');

/*app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});*/

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');
const projectsController = require('./projects/ProjectController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.static('public'));

app.use(
  session({
    secret: 'l;+LQmFYu=FSkcY0:AsQhANBU',
    cookie: { maxAge: 900000 },
    resave: true,
    saveUninitialized: true,
  }),
);

app.use('/admin', categoriesController);
app.use('/admin', articlesController);
app.use('/admin', usersController);
app.use('/admin', projectsController);
app.use(xss());

app.get('/', async (req, res) => {
  const resultPages = await Article.findAndCountAll();
  const countPages = resultPages.count;

  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4,
  })
    .then((articles) => {
      const loggedIN = loggedin(req);

      Category.findAll().then((categories) => {
        res.render('index', {
          articles,
          categories,
          loggedIN,
          countPages,
          ownedBlog,
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          const loggedIN = loggedin(req);
          res.render('article', { article, categories, loggedIN, ownedBlog });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((e) => {
      res.redirect('/');
    });
});

app.get('/category/:slug', async (req, res) => {
  const slug = req.params.slug;

  const resultPages = await Article.findAndCountAll();
  const countPages = resultPages.count;

  Category.findOne({
    where: {
      slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          const loggedIN = loggedin(req);
          res.render('index', {
            articles: category.articles,
            categories,
            loggedIN,
            countPages,
          });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

app.use(function (req, res, next) {
  res.status(404).render('page404');
});

app.listen(port, () => {
  console.log('O servidor está rodando na porta: ' + port);
});
