import React, { useState } from 'react';
import { ShoppingBag, Check, Copy, Printer, Bookmark, Plus, Trash2, ArrowLeft, CheckCircle2, RotateCcw, AlertCircle, ShoppingCart } from 'lucide-react';
import { GroceryItem, IngredientCategory, Recipe, SavedMealPlan } from '../types';

interface GroceryListScreenProps {
  groceryList: GroceryItem[];
  selectedRecipes: Recipe[];
  onUpdateGroceryList: (list: GroceryItem[]) => void;
  onSavePlan: () => void;
  onBackToMeals: () => void;
  isSaved: boolean;
}

const CATEGORIES_CONFIG: Record<
  IngredientCategory,
  { badgeBg: string; text: string; border: string; dot: string }
> = {
  Produce: {
    badgeBg: 'bg-[#F0F5F0]',
    text: 'text-[#285943]',
    border: 'border-[#78A878]/50',
    dot: 'bg-[#78A878]',
  },
  'Dairy & Eggs': {
    badgeBg: 'bg-[#FEF9EB]',
    text: 'text-[#26342D]',
    border: 'border-[#F4CF77]',
    dot: 'bg-[#F4CF77]',
  },
  'Bakery & Grains': {
    badgeBg: 'bg-[#F2F8FA]',
    text: 'text-[#285943]',
    border: 'border-[#BFDDE8]',
    dot: 'bg-[#BFDDE8]',
  },
  Proteins: {
    badgeBg: 'bg-[#FDF3F0]',
    text: 'text-[#E98B70]',
    border: 'border-[#E98B70]/50',
    dot: 'bg-[#E98B70]',
  },
  'Pantry & Spices': {
    badgeBg: 'bg-[#F7F5FC]',
    text: 'text-[#285943]',
    border: 'border-[#D9CFF0]',
    dot: 'bg-[#D9CFF0]',
  },
  'Beverages & Condiments': {
    badgeBg: 'bg-[#F2F8FA]',
    text: 'text-[#285943]',
    border: 'border-[#BFDDE8]',
    dot: 'bg-[#BFDDE8]',
  },
  Other: {
    badgeBg: 'bg-[#FAF8F1]',
    text: 'text-[#26342D]',
    border: 'border-[#E8E6DC]',
    dot: 'bg-[#66746B]',
  },
};

const CATEGORIES_ORDER: IngredientCategory[] = [
  'Produce',
  'Dairy & Eggs',
  'Bakery & Grains',
  'Proteins',
  'Pantry & Spices',
  'Beverages & Condiments',
  'Other',
];

export const GroceryListScreen: React.FC<GroceryListScreenProps> = ({
  groceryList,
  selectedRecipes,
  onUpdateGroceryList,
  onSavePlan,
  onBackToMeals,
  isSaved,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('Produce');

  // Toggle item checked state for shopping trips
  const toggleItemCheck = (id: string) => {
    onUpdateGroceryList(
      groceryList.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  // Toggle "I already have this" -> shifts between active shopping and pantry confirmed
  const toggleAvailability = (id: string) => {
    onUpdateGroceryList(
      groceryList.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    onUpdateGroceryList(groceryList.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newItemName.trim();
    if (!cleanName) return;

    const newItem: GroceryItem = {
      id: `custom-grocery-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      quantity: newItemQty.trim() || '1 item',
      category: newItemCategory,
      isChecked: false,
      isAvailable: false,
      recipeSources: ['Manual addition'],
    };

    onUpdateGroceryList([...groceryList, newItem]);
    setNewItemName('');
    setNewItemQty('');
  };

  // Copy plain text formatted list
  const copyAsPlainText = () => {
    const needed = groceryList.filter((i) => !i.isAvailable);
    const lines: string[] = ['=== SlothPlate Smart Grocery List ==='];
    lines.push(`For: ${selectedRecipes.map((r) => r.title).join(' • ')}\n`);

    CATEGORIES_ORDER.forEach((cat) => {
      const itemsInCat = needed.filter((i) => i.category === cat);
      if (itemsInCat.length > 0) {
        lines.push(`[${cat}]`);
        itemsInCat.forEach((item) => {
          lines.push(`• ${item.name} (${item.quantity})`);
        });
        lines.push('');
      }
    });

    const textToCopy = lines.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const itemsToBuy = groceryList.filter((i) => !i.isAvailable);
  const itemsInPantry = groceryList.filter((i) => i.isAvailable);
  const checkedCount = itemsToBuy.filter((i) => i.isChecked).length;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-7">
      {/* Printable Header */}
      <div className="hidden print-only mb-6">
        <h1 className="text-2xl font-bold text-black">SlothPlate Consolidated Grocery List</h1>
        <p className="text-sm text-gray-700">
          Generated for: {selectedRecipes.map((r) => r.title).join(', ')}
        </p>
        <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        <hr className="my-3 border-gray-400" />
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DC] pb-4 no-print">
        <div>
          <span className="text-xs font-bold text-[#285943] uppercase tracking-wider">
            Consolidated Plan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26342D] tracking-tight">
            Smart Grocery List
          </h2>
          <p className="text-xs sm:text-sm text-[#66746B] mt-1">
            Merged across {selectedRecipes.length} meal{selectedRecipes.length > 1 ? 's' : ''}. Quantities with matching units are automatically summed.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onBackToMeals}
            className="text-xs sm:text-sm font-semibold text-[#66746B] hover:text-[#26342D] px-3 py-1.5 rounded-xl hover:bg-[#E8E6DC]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Meals</span>
          </button>

          <button
            onClick={copyAsPlainText}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#26342D] bg-white border border-[#E8E6DC] hover:border-[#285943]/40 rounded-xl shadow-2xs hover:bg-[#FAF8F1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#285943]" />
            <span>{copiedToast ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#26342D] bg-white border border-[#E8E6DC] hover:border-[#285943]/40 rounded-xl shadow-2xs hover:bg-[#FAF8F1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#285943]" />
            <span>Print List</span>
          </button>

          <button
            onClick={onSavePlan}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-[#F0F5F0] text-[#285943] border border-[#78A878]'
                : 'bg-[#285943] hover:bg-[#1E4332] text-white hover:shadow-md'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved Locally ✓' : 'Save Plan & List'}</span>
          </button>
        </div>
      </div>

      {/* Selected Meals Summary Cards */}
      <div className="bg-white rounded-2xl border border-[#E8E6DC] p-5 space-y-3.5 shadow-xs no-print">
        <h3 className="font-extrabold text-xs text-[#26342D] uppercase tracking-wider">
          Included Meals in this list:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-3.5 rounded-xl bg-[#FAF8F1] border border-[#E8E6DC] space-y-1"
            >
              <h4 className="font-bold text-xs sm:text-sm text-[#26342D] leading-tight">
                {recipe.title}
              </h4>
              <div className="text-[11px] text-[#66746B] flex items-center gap-2">
                <span>{recipe.totalTimeMinutes}m total</span>
                <span>•</span>
                <span>{recipe.dishCount} dish</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Progress Bar with Leaf Green Fill */}
      {itemsToBuy.length > 0 && (
        <div className="bg-[#F0F5F0] border border-[#78A878]/40 rounded-2xl p-4 flex items-center justify-between text-xs text-[#26342D] shadow-2xs no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#78A878]" />
            <span>
              <strong>Shopping Progress:</strong> {checkedCount} of {itemsToBuy.length} items collected
            </span>
          </div>
          <div className="w-28 sm:w-44 bg-white h-2.5 rounded-full overflow-hidden border border-[#78A878]/30">
            <div
              className="bg-[#285943] h-full transition-all"
              style={{
                width: `${itemsToBuy.length > 0 ? (checkedCount / itemsToBuy.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Add Custom Item Input Form */}
      <div className="bg-white rounded-2xl border border-[#E8E6DC] p-5 space-y-3 shadow-xs no-print">
        <span className="text-xs font-bold text-[#26342D] uppercase tracking-wider block">
          Add an extra grocery item
        </span>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g. Oat milk, Lemons)"
            className="sm:col-span-5 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DC] focus:outline-none focus:border-[#285943]"
          />
          <input
            type="text"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            placeholder="Qty (e.g. 1 carton, 3 pcs)"
            className="sm:col-span-3 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DC] focus:outline-none focus:border-[#285943]"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as IngredientCategory)}
            className="sm:col-span-2 text-xs px-3 py-2.5 rounded-xl border border-[#E8E6DC] focus:outline-none focus:border-[#285943] bg-white cursor-pointer"
          >
            {CATEGORIES_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-2 py-2.5 bg-[#285943] hover:bg-[#1E4332] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* Grouped Grocery Items List */}
      <div className="space-y-6">
        {itemsToBuy.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E6DC] p-10 text-center space-y-2 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#78A878] mx-auto" />
            <h3 className="font-extrabold text-base text-[#26342D]">
              Your fridge already has everything needed!
            </h3>
            <p className="text-xs text-[#66746B]">
              All ingredients for your selected meals are confirmed available. Zero grocery shopping run needed.
            </p>
          </div>
        ) : (
          CATEGORIES_ORDER.map((category) => {
            const items = itemsToBuy.filter((item) => item.category === category);
            if (items.length === 0) return null;
            const config = CATEGORIES_CONFIG[category];

            return (
              <div
                key={category}
                className="bg-white rounded-2xl border border-[#E8E6DC] p-5 sm:p-6 space-y-3.5 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#E8E6DC] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                    <h3 className="font-extrabold text-sm text-[#26342D] tracking-tight">
                      {category}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${config.badgeBg} ${config.text} border ${config.border}`}>
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        item.isChecked
                          ? 'bg-[#FAF8F1] border-transparent text-[#66746B] line-through'
                          : 'bg-white border-[#E8E6DC] text-[#26342D] hover:border-[#BFDDE8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => toggleItemCheck(item.id)}
                          className="w-4 h-4 rounded text-[#285943] focus:ring-[#285943] cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-xs sm:text-sm">
                            {item.name}
                          </span>
                          <span className="ml-2 text-xs font-semibold text-[#285943] bg-[#F2F8FA] px-2.5 py-0.5 rounded-md border border-[#BFDDE8]">
                            {item.quantity}
                          </span>
                          {item.recipeSources.length > 0 && (
                            <span className="text-[10px] text-[#66746B] block pt-0.5">
                              Needed for: {item.recipeSources.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 no-print shrink-0">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className="text-[11px] font-bold text-[#285943] hover:underline px-2 py-1 rounded-lg hover:bg-[#F0F5F0] transition-colors cursor-pointer"
                          title="Mark that you already have this in pantry"
                        >
                          I have this
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-[#66746B] hover:text-[#E98B70] rounded-lg transition-colors cursor-pointer"
                          title="Delete from list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Already In Fridge Section */}
        {itemsInPantry.length > 0 && (
          <div className="bg-[#FAF8F1] rounded-2xl border border-[#E8E6DC] p-5 space-y-3 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#285943]">
                  Already In Your Fridge ({itemsInPantry.length})
                </h3>
                <p className="text-[11px] text-[#66746B]">
                  These confirmed pantry items were excluded from your shopping cart.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {itemsInPantry.map((item) => (
                <div
                  key={item.id}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E6DC] text-xs font-medium text-[#26342D] flex items-center gap-2 shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#78A878]" />
                  <span>{item.name}</span>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="text-[11px] font-semibold text-[#E98B70] hover:underline ml-1 cursor-pointer"
                    title="Move back to shopping list"
                  >
                    Need to buy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
