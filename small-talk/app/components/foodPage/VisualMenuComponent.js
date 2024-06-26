import React, { useState, useEffect } from 'react';

export default function VisualMenuComponent({ menuDataPath }) {
  // State to hold menu items and the selected item
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch menu data when menuDataPath changes
  useEffect(() => {
    // Dynamic import for JSON data based on passed prop
    import(`../../data/foodData/${menuDataPath}`).then(data => {
      setMenuItems(data.default);
    });
  }, [menuDataPath]); // Reload data when menuDataPath changes

  // Function to select or deselect an item
  const selectItem = (itemId) => {
    // Toggle selection: deselect if the same item is clicked again
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  // Function to confirm the order
  const confirmOrder = () => {
    alert("Your food is being prepared and will be on the way soon!");
    setSelectedItem(null); // Reset selection after confirming the order
  };

  return (
    // Render menu items and a confirm order button if an item is selected
    <div className="menu-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {menuItems.map((item) => (
        <div 
          key={item.id} 
          className={`menu-item border rounded-lg overflow-hidden shadow-lg cursor-pointer ${selectedItem === item.id ? 'bg-blue-800 text-white' : 'bg-white text-gray-900'}`}
          onClick={() => selectItem(item.id)}
        >
          {/* Render item image, name, description, and nutritional info button */}
          <img src={item.imgPath} alt={item.name} className="menu-item-img w-full h-48 object-cover"/>
          <div className="p-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm">{item.description}</p>
            <button
              className="nutritional-info-btn mt-2 text-blue-500 hover:text-blue-700 text-sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from triggering the selectItem
                alert(item.nutritionalInfo);
              }}
            >
              Nutritional Info
            </button>
          </div>
        </div>
      ))}
      {/* Render confirm order button if an item is selected */}
      {selectedItem && (
        <button 
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={confirmOrder}
        >
          Confirm Order
        </button>
      )}
    </div>
  );
}
