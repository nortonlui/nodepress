const loggedin = (req)=>{

    if(req.session.user != undefined || req.session.user != null ){
        return true;
    } else {
        return false;
    }
}

module.exports = loggedin;