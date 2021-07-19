const { validationResult } = require('express-validator');
const { Article, User } = require('../models');

module.exports = {

    get: {
        home: async function (req, res, next) {
            try {
                const rawArticles = await Article.find().sort({ createdAt: -1 }).limit(3).lean();
                const articles = rawArticles.map(article => {
                    article.description = article.description.split(' ').slice(0, 50).join(' ');
                    return article;
                })

                const hbsObject = {
                    articles
                };
                res.render('index.hbs', hbsObject);
            } catch (error) {
                res.render('error', error);
            }
        },
        allArticles: async function (req, res, next) {
            try {
                const articles = await Article.find().select('title');

                const hbsObject = {
                    articles
                };
                res.render('all-articles.hbs', hbsObject);
            } catch (error) {
                res.render('error', error);
            }
        },
        create: function (req, res, next) {

            res.render('create.hbs');
        },
        details: async function async(req, res, next) {
            try {
                const { id: articleId } = req.params;

                const userId = req.user ? req.user._id : '';

                const article = await Article.findById(articleId).lean();

                if (!article) {
                    const error = new Error(`Could not find article #id ${articleId}.`);
                    throw error;
                }

                article.description = article.description.split('\r\n\r\n');

                const hbsObject = {
                    isCreator: userId.toString() === article.creator.toString(),
                    article
                };
                res.render('article', hbsObject);
            } catch (error) {
                res.render('error', { error })
            }
        },
        edit: async function (req, res, next) {
            try {
                const { id: articleId } = req.params;

                const article = await Article.findById(articleId);

                if (!article) {
                    const error = new Error(`Could not find article #id ${articleId}.`);
                    throw error;
                }

                const hbsObject = {
                    article
                };

                res.render('edit.hbs', hbsObject);
            } catch (error) {
                res.render('error', { error });
            }
        },
        delete: async function (req, res, next) {
            try {
                const { id: articleId } = req.params;
                const { _id: userId } = req.user;

                const deletedArticle = await Article.findByIdAndDelete(articleId);
                await User.findByIdAndUpdate({ _id: userId }, { $pull: { articles: articleId } });
                res.redirect('/');
            } catch (error) {
                res.render('error', { error });
            }
        },
        error: function (req, res, next) {

            res.render(error);
        },
        notFound: function (req, res, next) {

            res.render('404.hbs');
        }
    },

    post: {
        create: async function (req, res, next) {
            try {
                const { title, description } = req.body;
                const userId = req.user._id;

                const errors = validationResult(req);

                if (!errors.isEmpty()) {

                    const hbsObject = {
                        title, description,
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('create.hbs', hbsObject)
                }

                const newArticle = new Article({ title, description, creator: userId });
                const articleId = newArticle._id;

                await newArticle.save();

                const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { articles: articleId } })
                res.redirect('/');
            } catch (error) {
                res.render('error', { error });
            }
        },
        edit: async function (req, res, next) {
            try {
                const { description, title } = req.body;
                const { id: articleId } = req.params;

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    article.description = description;
                    article.title = title;
                    article._id = articleId;

                    const hbsObject = {
                        article,
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('edit.hbs', hbsObject)
                }
                await Article.findByIdAndUpdate({ _id: articleId }, { description }, { runValidators: true });

                res.redirect('/');
            } catch (error) {
                res.render('error', { error });
            }
        },
        search: async function (req, res, next) {
            try {
                const { search } = req.body;
                const articles = await Article.find({ title: { $regex: search, $options: 'gi' } });
                res.render('all-articles.hbs', { articles });
            } catch (error) {
                res.render('error', { error });
            }
        }
    }
}