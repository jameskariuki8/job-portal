import User from '../models/user.model.js';
import createError from '../utils/createError.js';

export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (req.userId !== user._id.toString()) {
        return next(createError(403, 'you can delete only your account'));
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).send('deleted');
}
export const getUser = async (req, res) => {
    // console.log(res);
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
}

export const updateUser = async (req, res, next) => {
    try {
        if (req.userId !== req.params.id) return next(createError(403, 'you can update only your account'));
        const payload = req.body;
        const updated = await User.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true });
        res.status(200).send(updated);
    } catch (err) {
        next(err);
    }
}