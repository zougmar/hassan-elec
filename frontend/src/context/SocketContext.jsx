import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

function getSocketUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return window.location.origin;
  }
  return '';
}

export function SocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket.io needs a long-lived Node server (works locally). On Vercel serverless it may not connect.
    const url = getSocketUrl();
    if (!url) return undefined;

    const socket = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected || !isAuthenticated || !user) return;

    if (
      user.type === 'user' ||
      user.type === 'manager' ||
      user.role === 'admin' ||
      user.role === 'manager'
    ) {
      socket.emit('join:admin');
    }
    if (user.role === 'employee' || user.type === 'employee') {
      socket.emit('join:employee', user.id || user._id);
    }
  }, [connected, isAuthenticated, user]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
      on: (event, handler) => {
        const s = socketRef.current;
        if (!s) return () => {};
        s.on(event, handler);
        return () => s.off(event, handler);
      }
    }),
    [connected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext) || { socket: null, connected: false, on: () => () => {} };
}
