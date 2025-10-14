// hooks/useMenuData.js
import { useState, useEffect, useCallback } from "react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";
const authUsername = import.meta.env.VITE_API_USERNAME;
const authPassword = import.meta.env.VITE_API_PASSWORD;

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (authUsername && authPassword) {
    const credentials = btoa(`${authUsername}:${authPassword}`);
    headers['Authorization'] = `Basic ${credentials}`;
  }
  
  return headers;
};

export const useMenuData = (categories = []) => {
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscribe } = useWebSocketContext();

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);

      const fetchPromises = categories.map(category =>
        fetch(`${baseUrl}/api/products/category/${category}`, {
          headers: getAuthHeaders()
        })
      );

      const responses = await Promise.all(fetchPromises);

      const failedResponse = responses.find(res => !res.ok);
      if (failedResponse) {
        throw new Error("Failed to fetch menu data");
      }

      const dataPromises = responses.map(res => res.json());
      const dataResults = await Promise.all(dataPromises);

      const data = {};
      categories.forEach((category, index) => {
        data[category] = dataResults[index];
      });

      setMenuData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  }, [categories.join(",")]);

  const handleProductUpdate = useCallback((updatedProduct) => {
    setMenuData(prev => {
      const newData = { ...prev };
      
      Object.keys(newData).forEach(category => {
        const productIndex = newData[category].findIndex(p => p.id === updatedProduct.id);
        
        if (productIndex !== -1) {
          newData[category][productIndex] = updatedProduct;
        } else if (updatedProduct.category === category) {
          newData[category] = [...newData[category], updatedProduct];
        }
      });
      
      return newData;
    });
  }, []);

  const handleProductDelete = useCallback((productId) => {
    setMenuData(prev => {
      const newData = { ...prev };
      
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].filter(p => p.id !== productId);
      });
      
      return newData;
    });
  }, []);

  const handleExtraUpdate = useCallback((updatedExtra) => {
    setMenuData(prev => {
      const newData = { ...prev };
      
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].map(product => {
          if (product.extras) {
            const extraIndex = product.extras.findIndex(e => e.id === updatedExtra.id);
            
            if (extraIndex !== -1) {
              const updatedExtras = [...product.extras];
              updatedExtras[extraIndex] = updatedExtra;
              return { ...product, extras: updatedExtras };
            }
          }
          return product;
        });
      });
      
      return newData;
    });
  }, []);

  const handleExtraDelete = useCallback((extraId) => {
    setMenuData(prev => {
      const newData = { ...prev };
      
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].map(product => {
          if (product.extras) {
            return {
              ...product,
              extras: product.extras.filter(e => e.id !== extraId)
            };
          }
          return product;
        });
      });
      
      return newData;
    });
  }, []);

  // Subscribe to WebSocket updates
  useEffect(() => {
    const unsubscribeProductUpdate = subscribe('productUpdate', handleProductUpdate);
    const unsubscribeProductDelete = subscribe('productDelete', handleProductDelete);
    const unsubscribeExtraUpdate = subscribe('extraUpdate', handleExtraUpdate);
    const unsubscribeExtraDelete = subscribe('extraDelete', handleExtraDelete);

    return () => {
      unsubscribeProductUpdate();
      unsubscribeProductDelete();
      unsubscribeExtraUpdate();
      unsubscribeExtraDelete();
    };
  }, [subscribe, handleProductUpdate, handleProductDelete, handleExtraUpdate, handleExtraDelete]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchMenuData();
    }
  }, [categories.join(","), fetchMenuData]);

  return { menuData, loading, error, refetch: fetchMenuData };
};

export const useSingleCategory = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscribe } = useWebSocketContext();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/products/category/${category}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching category:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const handleProductUpdate = useCallback((updatedProduct) => {
    if (updatedProduct.category === category) {
      setData(prev => {
        const index = prev.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          const newData = [...prev];
          newData[index] = updatedProduct;
          return newData;
        } else {
          return [...prev, updatedProduct];
        }
      });
    }
  }, [category]);

  const handleProductDelete = useCallback((productId) => {
    setData(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleExtraUpdate = useCallback((updatedExtra) => {
    setData(prev => prev.map(product => {
      if (product.extras) {
        const extraIndex = product.extras.findIndex(e => e.id === updatedExtra.id);
        if (extraIndex !== -1) {
          const updatedExtras = [...product.extras];
          updatedExtras[extraIndex] = updatedExtra;
          return { ...product, extras: updatedExtras };
        }
      }
      return product;
    }));
  }, []);

  const handleExtraDelete = useCallback((extraId) => {
    setData(prev => prev.map(product => {
      if (product.extras) {
        return {
          ...product,
          extras: product.extras.filter(e => e.id !== extraId)
        };
      }
      return product;
    }));
  }, []);

  useEffect(() => {
    const unsubscribeProductUpdate = subscribe('productUpdate', handleProductUpdate);
    const unsubscribeProductDelete = subscribe('productDelete', handleProductDelete);
    const unsubscribeExtraUpdate = subscribe('extraUpdate', handleExtraUpdate);
    const unsubscribeExtraDelete = subscribe('extraDelete', handleExtraDelete);

    return () => {
      unsubscribeProductUpdate();
      unsubscribeProductDelete();
      unsubscribeExtraUpdate();
      unsubscribeExtraDelete();
    };
  }, [subscribe, handleProductUpdate, handleProductDelete, handleExtraUpdate, handleExtraDelete]);

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [category, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useBuildYourOwn = (category = "Componi-Panino") => {
  const [data, setData] = useState(null);
  const [groupedExtras, setGroupedExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscribe } = useWebSocketContext();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/products/category/${category}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch build your own data");
      }

      const result = await response.json();
      const item = result[0];
      setData(item);

      if (item?.extras) {
        const grouped = item.extras.reduce((acc, extra) => {
          if (!acc[extra.type]) {
            acc[extra.type] = [];
          }
          acc[extra.type].push(extra);
          return acc;
        }, {});
        setGroupedExtras(grouped);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching build your own:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const handleProductUpdate = useCallback((updatedProduct) => {
    if (updatedProduct.id === data?.id) {
      setData(updatedProduct);
      if (updatedProduct.extras) {
        const grouped = updatedProduct.extras.reduce((acc, extra) => {
          if (!acc[extra.type]) {
            acc[extra.type] = [];
          }
          acc[extra.type].push(extra);
          return acc;
        }, {});
        setGroupedExtras(grouped);
      }
    }
  }, [data?.id]);

  const handleExtraUpdate = useCallback((updatedExtra) => {
    setData(prev => {
      if (!prev || !prev.extras) return prev;
      
      const extraIndex = prev.extras.findIndex(e => e.id === updatedExtra.id);
      if (extraIndex !== -1) {
        const updatedExtras = [...prev.extras];
        updatedExtras[extraIndex] = updatedExtra;
        
        const grouped = updatedExtras.reduce((acc, extra) => {
          if (!acc[extra.type]) {
            acc[extra.type] = [];
          }
          acc[extra.type].push(extra);
          return acc;
        }, {});
        setGroupedExtras(grouped);
        
        return { ...prev, extras: updatedExtras };
      }
      return prev;
    });
  }, []);

  const handleExtraDelete = useCallback((extraId) => {
    setData(prev => {
      if (!prev || !prev.extras) return prev;
      
      const updatedExtras = prev.extras.filter(e => e.id !== extraId);
      
      const grouped = updatedExtras.reduce((acc, extra) => {
        if (!acc[extra.type]) {
          acc[extra.type] = [];
        }
        acc[extra.type].push(extra);
        return acc;
      }, {});
      setGroupedExtras(grouped);
      
      return { ...prev, extras: updatedExtras };
    });
  }, []);

  useEffect(() => {
    const unsubscribeProductUpdate = subscribe('productUpdate', handleProductUpdate);
    const unsubscribeExtraUpdate = subscribe('extraUpdate', handleExtraUpdate);
    const unsubscribeExtraDelete = subscribe('extraDelete', handleExtraDelete);

    return () => {
      unsubscribeProductUpdate();
      unsubscribeExtraUpdate();
      unsubscribeExtraDelete();
    };
  }, [subscribe, handleProductUpdate, handleExtraUpdate, handleExtraDelete]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, groupedExtras, loading, error, refetch: fetchData };
};