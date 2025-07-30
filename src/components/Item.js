import React, { useState } from "react";
import "./Item.css";

function Item({ item, onUpdateItem, onDeleteItem }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddToCartClick = async () => {
    setIsUpdating(true);
    try {
      const updatedItem = { ...item, isInCart: !item.isInCart };
      await onUpdateItem(updatedItem);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Delete ${item.name}?`)) {
      setIsDeleting(true);
      try {
        await onDeleteItem(item.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <li className={`item-card ${item.isInCart ? "in-cart" : ""}`}>
      <div className="item-info">
        <span className="item-name">{item.name}</span>
        <span className="item-category">{item.category}</span>
      </div>
      <div className="item-actions">
        <button
          className={`action-btn ${item.isInCart ? "remove" : "add"}`}
          onClick={handleAddToCartClick}
          disabled={isUpdating}
        >
          {isUpdating ? "..." : item.isInCart ? "✓" : "+"}
        </button>
        <button
          className="action-btn delete"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? "..." : "✕"}
        </button>
      </div>
    </li>
  );
}

export default Item;