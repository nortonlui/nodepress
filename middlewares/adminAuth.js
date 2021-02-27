const adminAuth = (req, res, next) => {
    if(req.session.user != undefined ){
        next();
    } else {
        res.redirect('/admin/users/login/');
    }
   
}

module.exports = adminAuth;