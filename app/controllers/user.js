const userService = require('../service/user.js');

var getUser = async (ctx, next) => {
    let userId = ctx.params.id;
    let user = await userService.getUserById(userId);
	await ctx.render('user', {user: user});
};

module.exports = {
    'GET /users/:id': getUser,
/*
    'POST /users': addUser,
    'PUT /users/id': updateUser,
    'DELETE /users/:id': deleteUser
*/
};