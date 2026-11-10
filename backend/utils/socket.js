let io = null;

export function initSocket(server) {
  // Dynamic import keeps Vercel serverless bundle lighter when sockets are unused
  return import('socket.io').then(({ Server }) => {
    io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      path: '/socket.io'
    });

    io.on('connection', (socket) => {
      socket.on('join:admin', () => {
        socket.join('admin');
      });
      socket.on('join:employee', (employeeId) => {
        if (employeeId) socket.join(`employee:${employeeId}`);
      });
    });

    console.log('Socket.io ready');
    return io;
  });
}

export function getIO() {
  return io;
}

export function emitToAdmin(event, payload) {
  if (!io) return;
  io.to('admin').emit(event, payload);
}

export function emitToEmployee(employeeId, event, payload) {
  if (!io || !employeeId) return;
  io.to(`employee:${employeeId}`).emit(event, payload);
}
