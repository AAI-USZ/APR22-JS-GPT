if (req.session.authed) return next();
res.redirect('/admin/auth');
};
