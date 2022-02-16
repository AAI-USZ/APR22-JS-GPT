if (req.body.remember) res.cookie('remember', 1, { maxAge: minute });
res.redirect('back');
});
