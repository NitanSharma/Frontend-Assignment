const jwt  = require('jsonwebtoken');
const User = require('../models/User.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        return next();        
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}