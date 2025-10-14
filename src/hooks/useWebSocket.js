// hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Fix for sockjs-client in Vite
if (typeof global === 'undefined') {
  window.global = window;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";
const authUsername = import.meta.env.VITE_API_USERNAME;
const authPassword = import.meta.env.VITE_API_PASSWORD;

export const useWebSocket = (onProductUpdate, onProductDelete, onExtraUpdate, onExtraDelete) => {
  const clientRef = useRef(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    // Create connection headers with basic auth if credentials are provided
    const connectHeaders = {};
    if (authUsername && authPassword) {
      const credentials = btoa(`${authUsername}:${authPassword}`);
      connectHeaders['Authorization'] = `Basic ${credentials}`;
    }

    // Create a new STOMP client
    const client = new Client({
      // Use SockJS as the WebSocket implementation
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      
      // Connection headers (includes auth)
      connectHeaders: connectHeaders,
      
      // Connection timeout
      connectionTimeout: 5000,
      
      // Heartbeat settings (in milliseconds)
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      
      // Reconnect settings
      reconnectDelay: 5000,
      
      // Debug function
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      
      // On successful connection
      onConnect: () => {
        console.log('WebSocket Connected');
        isConnectedRef.current = true;
        
        // Subscribe to product updates
        client.subscribe('/topic/products/update', (message) => {
          const product = JSON.parse(message.body);
          console.log('Product Update Received:', product);
          if (onProductUpdate) {
            onProductUpdate(product);
          }
        });
        
        // Subscribe to product deletions
        client.subscribe('/topic/products/delete', (message) => {
          const productId = parseInt(message.body);
          console.log('Product Delete Received:', productId);
          if (onProductDelete) {
            onProductDelete(productId);
          }
        });
        
        // Subscribe to extra updates
        client.subscribe('/topic/extras/update', (message) => {
          const extra = JSON.parse(message.body);
          console.log('Extra Update Received:', extra);
          if (onExtraUpdate) {
            onExtraUpdate(extra);
          }
        });
        
        // Subscribe to extra deletions
        client.subscribe('/topic/extras/delete', (message) => {
          const extraId = parseInt(message.body);
          console.log('Extra Delete Received:', extraId);
          if (onExtraDelete) {
            onExtraDelete(extraId);
          }
        });
      },
      
      // On connection error
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        isConnectedRef.current = false;
      },
      
      // On WebSocket close
      onWebSocketClose: () => {
        console.log('WebSocket Disconnected');
        isConnectedRef.current = false;
      },
    });

    clientRef.current = client;
    client.activate();
  }, [onProductUpdate, onProductDelete, onExtraUpdate, onExtraDelete]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      isConnectedRef.current = false;
      console.log('WebSocket Disconnecting...');
    }
  }, []);

  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: isConnectedRef.current,
    disconnect,
    reconnect: connect,
  };
};