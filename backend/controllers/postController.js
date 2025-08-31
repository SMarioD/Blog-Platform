const { Post, User, Comment } = require('../models');

exports.showCreatePage = (req, res) => {
    res.render('posts/create');
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login');
        }

        await Post.create({
            title,
            content,
            userId: userId
        });
        
        req.flash('success_msg', 'Postarea a fost creată cu succes!');
        res.redirect('/');
    } catch (error) {
        console.error("Eroare la crearea postării:", error);
        res.status(500).send("Eroare la crearea postării.");
    }
};

exports.showPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            include: [
                { model: User, attributes: ['username'] },
                { 
                    model: Comment,
                    include: { model: User, attributes: ['username'] }
                }
            ],
            order: [[Comment, 'createdAt', 'ASC']]
        });

        if (post) {
            res.render('posts/show', { post: post });
        } else {
            res.status(404).send('Postarea nu a fost găsită.');
        }
    } catch (error) {
        console.error("Eroare la afișarea postării:", error);
        res.status(500).send("Eroare la afișarea postării.");
    }
};

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.session.userId;
        const { content } = req.body;

        if (!userId) { return res.redirect('/login'); }
        if (!content || content.trim() === '') { return res.redirect(`/posts/${postId}`); }

        await Comment.create({
            content: content,
            postId: postId,
            userId: userId
        });

        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Eroare la adăugarea comentariului:", error);
        res.status(500).send("Eroare la adăugarea comentariului.");
    }
};


exports.showEditPage = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) { return res.status(404).send("Postarea nu a fost găsită."); }
        if (post.userId !== req.session.userId) { return res.status(403).send("Acțiune nepermisă. Nu sunteți autorul."); }

        res.render('posts/edit', { post: post });
    } catch (error) {
        console.error("Eroare la afișarea paginii de editare:", error);
        res.status(500).send("Eroare internă a serverului.");
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        const post = await Post.findByPk(postId);

        if (!post) { return res.status(404).send("Postarea nu a fost găsită."); }
        if (post.userId !== req.session.userId) { return res.status(403).send("Acțiune nepermisă."); }

        await post.update({ title, content });
        req.flash('success_msg', 'Postarea a fost actualizată cu succes!');
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Eroare la actualizarea postării:", error);
        res.status(500).send("Eroare internă a serverului.");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) { return res.status(404).send("Postarea nu a fost găsită."); }
        if (post.userId !== req.session.userId) { return res.status(403).send("Acțiune nepermisă."); }

        await post.destroy();
        req.flash('success_msg', 'Postarea a fost ștearsă cu succes.');
        res.redirect('/');
    } catch (error) {
        console.error("Eroare la ștergerea postării:", error);
        res.status(500).send("Eroare la ștergerea postării.");
    }
};