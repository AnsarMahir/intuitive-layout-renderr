// contexts/WebSocketContext.jsx
import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Fix for sockjs-client in Vite
if (typeof global === 'undefined') {
  window.global = window;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";
const authUsername = import.meta.env.VITE_API_USERNAME;
const authPassword = import.meta.env.VITE_API_PASSWORD;

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const clientRef = useRef(null);
  const isConnectedRef = useRef(false);
  const subscribersRef = useRef({
    productUpdate: new Set(),
    productDelete: new Set(),
    extraUpdate: new Set(),
    extraDelete: new Set(),
  });

  const subscribe = useCallback((type, callback) => {
    subscribersRef.current[type].add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribersRef.current[type].delete(callback);
    };
  }, []);

  const notifySubscribers = useCallback((type, data) => {
    subscribersRef.current[type].forEach(callback => callback(data));
  }, []);

  const connect = useCallback(() => {
    if (clientRef.current?.active) {
      console.log('WebSocket already connected');
      return;
    }

    const connectHeaders = {};
    if (authUsername && authPassword) {
      const credentials = btoa(`${authUsername}:${authPassword}`);
      connectHeaders['Authorization'] = `Basic ${credentials}`;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      connectHeaders: connectHeaders,
      connectionTimeout: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      
      onConnect: () => {
        console.log('WebSocket Connected (Shared)');
        isConnectedRef.current = true;
        
        // Subscribe to all topics once
        client.subscribe('/topic/products/update', (message) => {
          const product = JSON.parse(message.body);
          console.log('Product Update Received:', product);
          notifySubscribers('productUpdate', product);
        });
        
        client.subscribe('/topic/products/delete', (message) => {
          const productId = parseInt(message.body);
          console.log('Product Delete Received:', productId);
          notifySubscribers('productDelete', productId);
        });
        
        client.subscribe('/topic/extras/update', (message) => {
          const extra = JSON.parse(message.body);
          console.log('Extra Update Received:', extra);
          notifySubscribers('extraUpdate', extra);
        });
        
        client.subscribe('/topic/extras/delete', (message) => {
          const extraId = parseInt(message.body);
          console.log('Extra Delete Received:', extraId);
          notifySubscribers('extraDelete', extraId);
        });
      },
      
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        isConnectedRef.current = false;
      },
      
      onWebSocketClose: () => {
        console.log('WebSocket Disconnected');
        isConnectedRef.current = false;
      },
    });

    clientRef.current = client;
    client.activate();
  }, [notifySubscribers]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      isConnectedRef.current = false;
      console.log('WebSocket Disconnecting...');
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const value = {
    isConnected: isConnectedRef.current,
    subscribe,
    disconnect,
    reconnect: connect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};