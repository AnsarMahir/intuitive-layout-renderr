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

// New hook to fetch category name by ID
export const useCategoryName = (categoryId) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/products/category/getname/${categoryId}`,
          { headers: getAuthHeaders() }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch category name for ID ${categoryId}`);
        }

        const text = await response.text();
        let categoryName;
        try {
          // Try to parse as JSON
          const data = JSON.parse(text);
          categoryName = data.name || data;
        } catch {
          // If not JSON, use as plain text
          categoryName = text;
        }
        setName(categoryName);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching category name for ID ${categoryId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  return { name, loading, error };
};

// New hook to fetch logo
export const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/uploads/logo`,
          { headers: getAuthHeaders() }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch logo");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setLogoUrl(url);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching logo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();

    // Cleanup
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, []);

  return { logoUrl, loading, error };
};

export const useMenuData = (categoryIds = []) => {
  const [menuData, setMenuData] = useState({});
  const [categoryNames, setCategoryNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscribe } = useWebSocketContext();

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);

      // First, fetch all category names
      const namePromises = categoryIds.map(id =>
        fetch(`${baseUrl}/api/products/category/getname/${id}`, {
          headers: getAuthHeaders()
        })
      );

      const nameResponses = await Promise.all(namePromises);
      
      const failedNameResponse = nameResponses.find(res => !res.ok);
      if (failedNameResponse) {
        throw new Error("Failed to fetch category names");
      }

      // Handle both JSON and plain text responses
      const nameResults = await Promise.all(
        nameResponses.map(async (res) => {
          const text = await res.text();
          try {
            // Try to parse as JSON first
            return JSON.parse(text);
          } catch {
            // If not JSON, return as plain text
            return text;
          }
        })
      );
      
      // Map IDs to names
      const idToName = {};
      categoryIds.forEach((id, index) => {
        const nameData = nameResults[index];
        idToName[id] = typeof nameData === 'string' ? nameData : nameData.name;
      });
      
      setCategoryNames(idToName);

      // Then fetch products using the category names
      const productPromises = Object.values(idToName).map(categoryName =>
        fetch(`${baseUrl}/api/products/category/${categoryName}`, {
          headers: getAuthHeaders()
        })
      );

      const responses = await Promise.all(productPromises);

      const failedResponse = responses.find(res => !res.ok);
      if (failedResponse) {
        throw new Error("Failed to fetch menu data");
      }

      const dataPromises = responses.map(res => res.json());
      const dataResults = await Promise.all(dataPromises);

      const data = {};
      Object.values(idToName).forEach((categoryName, index) => {
        data[categoryName] = dataResults[index];
      });

      setMenuData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryIds.join(",")]);

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
    if (categoryIds.length > 0) {
      fetchMenuData();
    }
  }, [categoryIds.join(","), fetchMenuData]);

  return { menuData, loading, error, refetch: fetchMenuData, categoryNames };
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

export const useScreenImages = (screenNumber, imageCount = 4) => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const imagePromises = [];
      
      for (let i = 1; i <= imageCount; i++) {
        const imageKey = `S${screenNumber}I${i}`;
        imagePromises.push(
          fetch(`${baseUrl}/api/uploads/images/${imageKey}`, {
            headers: getAuthHeaders()
          })
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch ${imageKey}`);
              return res.blob();
            })
            .then(blob => ({ key: imageKey, url: URL.createObjectURL(blob) }))
        );
      }

      const results = await Promise.all(imagePromises);
      const imagesObject = results.reduce((acc, { key, url }) => {
        acc[key] = url;
        return acc;
      }, {});

      setImages(imagesObject);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [screenNumber, imageCount]);

  useEffect(() => {
    fetchImages();
    
    // Cleanup: revoke object URLs when component unmounts
    return () => {
      Object.values(images).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
};

// New hook to fetch utility settings
export const useUtilitySettings = () => {
  const [fontTopic, setFontTopic] = useState({ size: 20 }); // Default size
  const [fontDesc, setFontDesc] = useState({ size: 14 }); // Default size
  const [bgColor, setBgColor] = useState({ color: "#000000" }); // Default color
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUtilitySettings = async () => {
      try {
        setLoading(true);

        // Fetch all utility settings in parallel
        const [topicRes, descRes, bgRes] = await Promise.all([
          fetch(`${baseUrl}/api/utility/get`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name: "FONTTOPIC" })
          }),
          fetch(`${baseUrl}/api/utility/get`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name: "FONTDESC" })
          }),
          fetch(`${baseUrl}/api/utility/get`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name: "BGCOLOR" })
          })
        ]);

        if (!topicRes.ok || !descRes.ok || !bgRes.ok) {
          throw new Error("Failed to fetch utility settings");
        }

        const [topicData, descData, bgData] = await Promise.all([
          topicRes.json(),
          descRes.json(),
          bgRes.json()
        ]);

        setFontTopic({ size: topicData.size || 20 });
        setFontDesc({ size: descData.size || 14 });
        setBgColor({ color: bgData.color || "#000000" });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching utility settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilitySettings();
  }, []);

  return { fontTopic, fontDesc, bgColor, loading, error };
};