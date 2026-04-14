const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Group = require('../models/Group');

exports.createPost = async (req, res) => {
    try{
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({msg: 'Group not found'});
        if (!group.members.includes(req.user.id))
            return res.status(401).json({msg: 'Only members can post'});
        const post = new Post({ group: req.params.groupId, author: req.user.id, content: req.body.content });
        await post.save();
        res.json(post);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getGroupPosts = async (req, res) => {
    try{
        const posts = await Post.find({group: req.params.groupId})
        .populate('author', 'name')
        .sort({createdAt: -1});
        res.json(posts);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.addComment = async (req, res) => {
    try{
        const comment = new Comment({ post: req.params.postId, author: req.user.id, content: req.body.content });
        await comment.save();
        res.json(comment);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getPostComments = async (req, res) => {
    try{
        const comments = await Comment.find({post: req.params.postId}).populate('author', 'name');
        res.json(comments);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');

    }
};
