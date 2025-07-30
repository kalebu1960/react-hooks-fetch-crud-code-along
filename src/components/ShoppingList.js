import React, { useEffect, useState } from 'react';
import Item from './Item';
import NewItemForm from './NewItemForm';
import Filter from './Filter';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  return (
    <div className="ShoppingList" data-testid="shopping-list">
      {isLoading && <p data-testid="loading">Loading...</p>}
      {error && <p data-testid="error">Error loading items!</p>}

     + <NewItemForm onAddItem={handleAddItem} />
      <Filter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
