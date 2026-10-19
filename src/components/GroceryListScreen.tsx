import React, { useState } from 'react';
import { ShoppingBag, Check, Copy, Printer, Bookmark, Plus, Trash2, ArrowLeft, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { GroceryItem, IngredientCategory, Recipe, SavedMealPlan } from '../types';

interface GroceryListScreenProps {
  groceryList: GroceryItem[];
  selectedRecipes: Recipe[];
  onUpdateGroceryList: (list: GroceryItem[]) => void;
  onSavePlan: () => void;
  onBackToMeals: () => void;
  isSaved: boolean;
}

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
    const lines: string[] = ['=== SlothPlate Grocery List ==='];
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
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Printable Header (Visible only when printed) */}
      <div className="hidden print-only mb-6">
        <h1 className="text-2xl font-bold text-black">SlothPlate Consolidated Grocery List</h1>
        <p className="text-sm text-gray-700">
          Generated for: {selectedRecipes.map((r) => r.title).join(', ')}
        </p>
        <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        <hr className="my-3 border-gray-400" />
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7DF] pb-4 no-print">
        <div>
          <span className="text-xs font-semibold text-[#355E46] uppercase tracking-wider">
            Consolidated Plan
          </span>
          <h2 className="text-2xl font-bold text-[#26352B] tracking-tight">
            Smart Grocery List
          </h2>
          <p className="text-xs sm:text-sm text-[#607266] mt-0.5">
            Combined for {selectedRecipes.length} selected meal{selectedRecipes.length > 1 ? 's' : ''}. Quantities are automatically merged.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onBackToMeals}
            className="text-xs sm:text-sm text-[#607266] hover:text-[#26352B] px-3 py-1.5 rounded-lg hover:bg-[#E5E7DF]/40 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Meals</span>
          </button>

          <button
            onClick={copyAsPlainText}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#26352B] bg-white border border-[#E5E7DF] hover:border-[#355E46]/40 rounded-lg shadow-xs hover:bg-[#F7F6F0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#355E46]" />
            <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#26352B] bg-white border border-[#E5E7DF] hover:border-[#355E46]/40 rounded-lg shadow-xs hover:bg-[#F7F6F0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#355E46]" />
            <span>Print List</span>
          </button>

          <button
            onClick={onSavePlan}
            className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-[#DCE8D8] text-[#355E46]'
                : 'bg-[#355E46] hover:bg-[#23402F] text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved Locally ✓' : 'Save Plan & List'}</span>
          </button>
        </div>
      </div>

      {/* Selected Meals Summary Cards */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-5 space-y-3 shadow-xs no-print">
        <h3 className="font-bold text-sm text-[#26352B] uppercase tracking-wider">
          Included Meals in this list:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="p-3 rounded-xl bg-[#F7F6F0] border border-[#E5E7DF] space-y-1"
            >
              <h4 className="font-semibold text-xs sm:text-sm text-[#26352B] leading-tight">
                {recipe.title}
              </h4>
              <div className="text-[11px] text-[#607266] flex items-center gap-2">
                <span>{recipe.totalTimeMinutes}m total</span>
                <span>•</span>
                <span>{recipe.dishCount} dish</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Progress Bar (for in-store use) */}
      {itemsToBuy.length > 0 && (
        <div className="bg-[#DCE8D8]/40 border border-[#DCE8D8] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#26352B] no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#355E46]" />
            <span>
              <strong>Shopping Progress:</strong> {checkedCount} of {itemsToBuy.length} items collected
            </span>
          </div>
          <div className="w-24 sm:w-36 bg-white h-2 rounded-full overflow-hidden border border-[#DCE8D8]">
            <div
              className="bg-[#355E46] h-full transition-all"
              style={{
                width: `${itemsToBuy.length > 0 ? (checkedCount / itemsToBuy.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Add Custom Item Input Form */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-4.5 space-y-3 shadow-xs no-print">
        <span className="text-xs font-bold text-[#26352B] uppercase tracking-wider block">
          Add an extra grocery item
        </span>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g. Oat milk, Lemons)"
            className="sm:col-span-5 text-xs px-3 py-2 rounded-xl border border-[#E5E7DF] focus:outline-none focus:border-[#355E46]"
          />
          <input
            type="text"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            placeholder="Qty (e.g. 1 carton, 3 pcs)"
            className="sm:col-span-3 text-xs px-3 py-2 rounded-xl border border-[#E5E7DF] focus:outline-none focus:border-[#355E46]"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as IngredientCategory)}
            className="sm:col-span-2 text-xs px-2.5 py-2 rounded-xl border border-[#E5E7DF] focus:outline-none focus:border-[#355E46] bg-white"
          >
            {CATEGORIES_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-2 py-2 bg-[#355E46] hover:bg-[#23402F] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* Grouped Grocery Items List */}
      <div className="space-y-6">
        {itemsToBuy.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7DF] p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#355E46] mx-auto" />
            <h3 className="font-bold text-base text-[#26352B]">
              Your fridge already has everything needed!
            </h3>
            <p className="text-xs text-[#607266]">
              All ingredients for your selected meals are already confirmed available. Zero grocery run needed.
            </p>
          </div>
        ) : (
          CATEGORIES_ORDER.map((category) => {
            const items = itemsToBuy.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl border border-[#E5E7DF] p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#E5E7DF] pb-2">
                  <h3 className="font-bold text-sm text-[#26352B] tracking-tight">
                    {category}
                  </h3>
                  <span className="text-xs text-[#607266]">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                        item.isChecked
                          ? 'bg-[#F7F6F0]/60 border-transparent text-[#607266] line-through'
                          : 'bg-white border-[#E5E7DF] text-[#26352B]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => toggleItemCheck(item.id)}
                          className="w-4 h-4 rounded text-[#355E46] focus:ring-[#355E46] cursor-pointer"
                        />
                        <div>
                          <span className="font-semibold text-xs sm:text-sm">
                            {item.name}
                          </span>
                          <span className="ml-2 text-xs font-medium text-[#607266] bg-[#F7F6F0] px-2 py-0.5 rounded">
                            {item.quantity}
                          </span>
                          {item.recipeSources.length > 0 && (
                            <span className="text-[10px] text-[#607266] block pt-0.5">
                              Needed for: {item.recipeSources.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 no-print shrink-0">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className="text-[11px] font-medium text-[#355E46] hover:underline px-2 py-1 rounded hover:bg-[#DCE8D8]/40"
                          title="Mark that you already have this in pantry"
                        >
                          I have this
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-[#607266] hover:text-rose-600 rounded transition-colors"
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

        {/* Already In Fridge Section (Accordion or Collapsed view) */}
        {itemsInPantry.length > 0 && (
          <div className="bg-[#F7F6F0] rounded-2xl border border-[#E5E7DF] p-5 space-y-3 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#355E46]">
                  Already In Your Fridge ({itemsInPantry.length})
                </h3>
                <p className="text-[11px] text-[#607266]">
                  These confirmed pantry items were excluded from your shopping cart.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {itemsInPantry.map((item) => (
                <div
                  key={item.id}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E7DF] text-xs text-[#26352B] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#355E46]" />
                  <span>{item.name}</span>
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="text-[10px] text-[#607266] hover:text-[#26352B] ml-1 underline"
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
