import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import customizationService from '../services/customizationService';
import './PizzaCustomizationModal.css';

const PizzaCustomizationModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || { name: 'Regular', price: product.price }
  );
  const [selectedCrust, setSelectedCrust] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [extraToppings, setExtraToppings] = useState([]);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isHalfHalf, setIsHalfHalf] = useState(false);
  const [halfFlavorNote, setHalfFlavorNote] = useState('');
  
  const [crustOptions, setCrustOptions] = useState([]);
  const [toppingOptions, setToppingOptions] = useState([]);
  const [sauceOptions, setSauceOptions] = useState([]);
  const [cheeseOptions, setCheeseOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomizationOptions = async () => {
      try {
        setIsLoading(true);
        const response = await customizationService.getAllOptions();
        const raw = response?.data?.data ?? response?.data ?? [];

        const grouped = Array.isArray(raw)
          ? raw.reduce((acc, option) => {
              if (!option || !option.optionType) return acc;
              const type = option.optionType;
              acc[type] = acc[type] || [];
              acc[type].push(option);
              return acc;
            }, {})
          : raw;

        const crusts = (grouped.crust || []).filter(o => o.isAvailable !== false);
        const toppings = (grouped.topping || []).filter(o => o.isAvailable !== false);
        const sauces = (grouped.sauce || []).filter(o => o.isAvailable !== false);
        const cheeses = (grouped.cheese || []).filter(o => o.isAvailable !== false);
        
        setCrustOptions(crusts);
        setToppingOptions(toppings);
        setSauceOptions(sauces);
        setCheeseOptions(cheeses);
        
        const defaultCrust = crusts.find(c => parseFloat(c.priceModifier) === 0) || crusts[0];
        if (defaultCrust) {
          setSelectedCrust(defaultCrust.id);
        }
        if (sauces.length > 0) {
          setSelectedSauce(sauces[0].id);
        }
        if (cheeses.length > 0) {
          setSelectedCheese(cheeses[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch customization options:', error);
        setCrustOptions([
          { id: 'fallback-regular', name: 'regular', displayName: 'Regular Crust', priceModifier: 0 }
        ]);
        setSelectedCrust('fallback-regular');
        setSauceOptions([{ id: 'fallback-sauce', displayName: 'House Tomato', priceModifier: 0 }]);
        setCheeseOptions([{ id: 'fallback-cheese', displayName: 'Mozzarella', priceModifier: 0 }]);
        setSelectedSauce('fallback-sauce');
        setSelectedCheese('fallback-cheese');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomizationOptions();
  }, []);

  const toggleTopping = (toppingId) => {
    setExtraToppings(prev =>
      prev.includes(toppingId)
        ? prev.filter(t => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const toggleIngredient = (ingredient) => {
    setRemovedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(selectedSize.price || product.price);
    const crustPrice = crustOptions.find(c => c.id === selectedCrust)?.priceModifier || 0;
    const saucePrice = sauceOptions.find(s => s.id === selectedSauce)?.priceModifier || 0;
    const cheesePrice = cheeseOptions.find(c => c.id === selectedCheese)?.priceModifier || 0;
    const toppingsPrice = extraToppings.reduce((sum, tId) => {
      const topping = toppingOptions.find(t => t.id === tId);
      return sum + parseFloat(topping?.priceModifier || 0);
    }, 0);
    const modifiers = [crustPrice, saucePrice, cheesePrice].reduce((sum, val) => sum + parseFloat(val || 0), 0);
    const halfFee = isHalfHalf ? 2 : 0; // flat prep fee for half/half
    return (basePrice + modifiers + toppingsPrice + halfFee) * quantity;
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      customization: {
        size: selectedSize,
        crust: crustOptions.find(c => c.id === selectedCrust),
        sauce: sauceOptions.find(s => s.id === selectedSauce),
        cheese: cheeseOptions.find(c => c.id === selectedCheese),
        extraToppings: extraToppings.map(tId => toppingOptions.find(t => t.id === tId)).filter(Boolean),
        removedIngredients,
        specialInstructions,
        half: {
          enabled: isHalfHalf,
          note: halfFlavorNote,
        },
      },
      price: calculateTotal() / quantity,
      quantity,
    };
    onAddToCart(customizedProduct);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="pizza-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
          <div className="modal-header">
            <h2>Loading customization options...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pizza-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className="modal-header">
          <h2>Customize Your {product.name}</h2>
          {product.description && <p className="modal-subtitle">{product.description}</p>}
        </div>

        <div className="modal-body">
          <div className="pizza-preview">
            <div className={`preview-circle ${isHalfHalf ? 'half' : ''}`}></div>
            <div className="half-toggle">
              <span>Half &amp; Half</span>
              <button
                type="button"
                className={`toggle ${isHalfHalf ? 'active' : ''}`}
                onClick={() => setIsHalfHalf(prev => !prev)}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
            {isHalfHalf && (
              <input
                type="text"
                className="half-note"
                placeholder="e.g., Second half: Hawaiian"
                value={halfFlavorNote}
                onChange={(e) => setHalfFlavorNote(e.target.value)}
              />
            )}
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="customization-section">
              <h3>Choose Size</h3>
              <div className="options-grid size-grid">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    className={`option-btn ${selectedSize.name === size.name ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="option-name">{size.name}</span>
                    <span className="option-price">${parseFloat(size.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Crust Selection */}
          {crustOptions.length > 0 && (
            <div className="customization-section">
              <h3>Choose Crust</h3>
              <div className="options-grid">
                {crustOptions.map((crust) => (
                  <button
                    key={crust.id}
                    className={`option-btn ${selectedCrust === crust.id ? 'active' : ''}`}
                    onClick={() => setSelectedCrust(crust.id)}
                  >
                    <span className="option-name">{crust.displayName}</span>
                    {parseFloat(crust.priceModifier) > 0 && (
                      <span className="option-price">+${parseFloat(crust.priceModifier).toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Remove Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="customization-section">
              <h3>Remove Ingredients (Optional)</h3>
              <div className="options-grid ingredients-grid">
                {product.ingredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    className={`option-btn small ${removedIngredients.includes(ingredient) ? 'removed' : ''}`}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sauce Selection */}
          {sauceOptions.length > 0 && (
            <div className="customization-section">
              <h3>Sauce</h3>
              <div className="pill-row">
                {sauceOptions.map(sauce => (
                  <button
                    key={sauce.id}
                    className={`pill ${selectedSauce === sauce.id ? 'active' : ''}`}
                    onClick={() => setSelectedSauce(sauce.id)}
                  >
                    {sauce.displayName}
                    {parseFloat(sauce.priceModifier) > 0 && (
                      <span className="pill-price">+${parseFloat(sauce.priceModifier).toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cheese Selection */}
          {cheeseOptions.length > 0 && (
            <div className="customization-section">
              <h3>Cheese</h3>
              <div className="pill-row">
                {cheeseOptions.map(cheese => (
                  <button
                    key={cheese.id}
                    className={`pill ${selectedCheese === cheese.id ? 'active' : ''}`}
                    onClick={() => setSelectedCheese(cheese.id)}
                  >
                    {cheese.displayName}
                    {parseFloat(cheese.priceModifier) > 0 && (
                      <span className="pill-price">+${parseFloat(cheese.priceModifier).toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Toppings */}
          {toppingOptions.length > 0 && (
            <div className="customization-section">
              <h3>Add Extra Toppings</h3>
              <div className="options-grid toppings-grid">
                {toppingOptions.map((topping) => (
                  <button
                    key={topping.id}
                    className={`option-btn small ${extraToppings.includes(topping.id) ? 'active' : ''}`}
                    onClick={() => toggleTopping(topping.id)}
                  >
                    <span className="option-name">{topping.displayName}</span>
                    <span className="option-price">+${parseFloat(topping.priceModifier).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="customization-section">
            <h3>Special Instructions (Optional)</h3>
            <textarea
              className="special-instructions"
              placeholder="e.g., Extra cheese, well done, cut into squares..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows="3"
            />
          </div>

          {/* Quantity */}
          <div className="customization-section">
            <h3>Quantity</h3>
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="total-price">
            <span>Total:</span>
            <span className="price-amount">${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="add-to-cart-final-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizationModal;
