const io = require('socket.io')(8900, {
	cors: {
		origin: ['http://localhost:3000', 'http://localhost:5173'],
	},
});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
	io.emit('welcome', 'this is socket server');

	socket.on('addUser', (userId) => {
		addUser(userId, socket.id);
	});

	socket.on('sendMessage', (message) => {
		const user = getUser(message.receiver?._id);

		if (user) {
			io.to(user?.socketId).emit('messageReceived', message);
		}
	});

	socket.on('disconnect', () => {
		removeUser(socket.id);
	});
});
