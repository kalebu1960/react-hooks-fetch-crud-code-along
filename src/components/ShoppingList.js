import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";
import "./Item.css";

function ShoppingList() {
  const categories = ["All", "Produce", "Dairy", "Dessert", "Bakery", "Meat"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:4000/items");
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Add new item
  const handleAddItem = async (newItem) => {
    const tempId = Date.now();
    try {
      setItems([...items, { ...newItem, id: tempId }]);
      
      const response = await fetch("http://localhost:4000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) throw new Error("Add failed");
      
      const serverItem = await response.json();
      setItems(prevItems => 
        prevItems.map(item => item.id === tempId ? serverItem : item)
      );
    } catch (error) {
      setItems(items.filter(item => item.id !== tempId));
      alert("Failed to add item");
    }
  };

  // Update item
  const handleUpdateItem = async (updatedItem) => {
    try {
      setItems(items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      
      const response = await fetch(`http://localhost:4000/items/${updatedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isInCart: updatedItem.isInCart }),
      });
      
      if (!response.ok) throw new Error("Update failed");
    } catch (error) {
      setItems([...items]);
      alert("Failed to update item");
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      setItems(items.filter(item => item.id !== itemId));
      
      const response = await fetch(`http://localhost:4000/items/${itemId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Delete failed");
    } catch (error) {
      setItems([...items]);
      alert("Failed to delete item");
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const itemsToDisplay = items.filter(item => 
    selectedCategory === "All" || item.category === selectedCategory
  );

  if (isLoading) return <div className="loading">Loading items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="shopping-list">
      <h2>My Shopping List</h2>
      <ItemForm onAddItem={handleAddItem} categories={categories.filter(c => c !== "All")} />
      <Filter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="items-container">
        {itemsToDisplay.map(item => (
          <Item
            key={item.id}
            item={item}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;