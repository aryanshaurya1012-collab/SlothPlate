import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Plus, AlertCircle, Sparkles, Check, HelpCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { ConfidenceLevel, Ingredient, IngredientCategory } from '../types';
import { validateImageFile, validateIngredientInput, sanitizeIngredientName } from '../utils/validation';

interface IngredientScannerProps {
  initialIngredients: Ingredient[];
  onConfirmIngredients: (ingredients: Ingredient[]) => void;
  onBack: () => void;
  onUseSampleIngredients: () => void;
}

interface ImageUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  base64Data: string;
  mimeType: string;
}

export const IngredientScanner: React.FC<IngredientScannerProps> = ({
  initialIngredients,
  onConfirmIngredients,
  onBack,
  onUseSampleIngredients,
}) => {
  const [images, setImages] = useState<ImageUploadItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [manualInput, setManualInput] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [scanAttempted, setScanAttempted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorNotice(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setErrorNotice('You can upload up to 3 fridge or pantry photos in total.');
      return;
    }

    const newUploads: ImageUploadItem[] = [];

    for (const file of files) {
      const val = validateImageFile(file);
      if (!val.valid) {
        setErrorNotice(val.error || 'Invalid file.');
        return;
      }

      // Convert file to base64
      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Extract pure base64 without prefix
            const clean = result.split(',')[1] || '';
            resolve(clean);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newUploads.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          base64Data,
          mimeType: file.type,
        });
      } catch (err) {
        console.error('File read error', err);
        setErrorNotice('Could not read image file.');
      }
    }

    setImages((prev) => [...prev, ...newUploads]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // Trigger AI analysis via POST /api/analyze-pantry
  const handleIdentifyIngredients = async () => {
    if (images.length === 0 && !manualNotes.trim()) {
      setErrorNotice('Please upload at least one fridge photo or add manual notes before scanning.');
      return;
    }

    setIsScanning(true);
    setErrorNotice(null);
    setScanAttempted(true);

    try {
      const payload = {
        images: images.map((img) => ({
          data: img.base64Data,
          mimeType: img.mimeType,
        })),
        manualNotes: manualNotes.trim() || undefined,
      };

      const res = await fetch('/api/analyze-pantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to detect ingredients with AI model.');
      }

      if (Array.isArray(data.data) && data.data.length > 0) {
        // Merge with existing ingredients avoiding exact duplicates
        setIngredients((prev) => {
          const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
          const novel = (data.data as Ingredient[]).filter(
            (i) => !existingNames.has(i.name.toLowerCase())
          );
          return [...prev, ...novel];
        });
      } else {
        setErrorNotice('No clear ingredients could be detected in this photo. You can enter them manually below.');
      }
    } catch (err: any) {
      console.error('AI Scan error:', err);
      setErrorNotice(
        err.message ||
          'Open-weight model service is currently unavailable. You can enter ingredients manually or try sample mode.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  // Add manual ingredient
  const handleAddManualIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = validateIngredientInput(manualInput);
    if (!val.valid) {
      setErrorNotice(val.error || 'Invalid ingredient');
      return;
    }

    const cleanName = sanitizeIngredientName(manualInput);
    const newIngredient: Ingredient = {
      id: `manual-ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      estimatedQuantity: '1 portion',
      confidence: 'high',
      notes: 'Manually verified by you',
      category: 'Other',
    };

    setIngredients((prev) => [...prev, newIngredient]);
    setManualInput('');
    setErrorNotice(null);
  };

  // Quick suggestion chips
  const quickSuggestions = ['Eggs', 'Cheddar cheese', 'Spinach', 'Cherry tomatoes', 'Sourdough bread', 'Garlic', 'Butter', 'Olive oil'];
  const addSuggestion = (name: string) => {
    if (ingredients.some((i) => i.name.toLowerCase() === name.toLowerCase())) return;
    setIngredients((prev) => [
      ...prev,
      {
        id: `sugg-${Date.now()}-${name}`,
        name,
        estimatedQuantity: 'Some',
        confidence: 'high',
        notes: 'Quick added',
        category: 'Produce',
      },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const handleProceed = () => {
    if (ingredients.length === 0) {
      setErrorNotice('Please add or confirm at least one ingredient to generate recipes.');
      return;
    }
    onConfirmIngredients(ingredients);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7DF] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#355E46] uppercase tracking-wider">
            Step 1 of 3
          </span>
          <h2 className="text-2xl font-bold text-[#26352B] tracking-tight">
            What's in your fridge or pantry?
          </h2>
          <p className="text-xs sm:text-sm text-[#607266] mt-0.5">
            Upload up to 3 photos or type ingredients manually. You can review and edit every item.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs sm:text-sm text-[#607266] hover:text-[#26352B] px-3 py-1.5 rounded-lg hover:bg-[#E5E7DF]/40 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Image Upload Zone */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[#26352B] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#355E46]" />
            Upload Fridge Photos (Max 3)
          </label>
          <span className="text-xs text-[#607266]">
            {images.length}/3 uploaded • Max 5MB each
          </span>
        </div>

        {/* Upload Thumbnails & Add Button */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E7DF] bg-[#F7F6F0] group"
            >
              <img
                src={img.previewUrl}
                alt={`Fridge upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-white text-rose-600 rounded-lg shadow-xs transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1 left-1.5 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                Photo {idx + 1}
              </div>
            </div>
          ))}

          {images.length < 3 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[#DCE8D8] hover:border-[#355E46] bg-[#F7F6F0]/60 hover:bg-[#F7F6F0] flex flex-col items-center justify-center p-3 text-center transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#355E46] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-1.5">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#26352B]">
                {images.length === 0 ? 'Upload Photo' : 'Add another'}
              </span>
              <span className="text-[10px] text-[#607266]">JPG, PNG, WebP</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Optional Notes */}
        <div>
          <label className="text-xs font-medium text-[#607266] block mb-1">
            Optional notes about your fridge (e.g. "Leftover rice in the plastic container, 4 eggs in carton"):
          </label>
          <input
            type="text"
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="e.g. half block of cheddar on top shelf, spinach in crisper"
            className="w-full text-xs px-3 py-2 rounded-lg border border-[#E5E7DF] bg-[#F7F6F0]/40 focus:bg-white focus:outline-none focus:border-[#355E46] transition-colors"
          />
        </div>

        {/* Privacy & Safety Notice */}
        <div className="p-3 rounded-xl bg-[#F7F6F0] border border-[#E5E7DF] flex items-start gap-2.5 text-xs text-[#607266]">
          <HelpCircle className="w-4 h-4 text-[#355E46] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#26352B]">Privacy notice:</strong> Photos are sent to the hosted open-weight Gemma model provider for ingredient recognition. Photos are processed in memory and are not permanently saved by SlothPlate.
          </div>
        </div>

        {/* Scan Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleIdentifyIngredients}
            disabled={isScanning || (images.length === 0 && !manualNotes.trim())}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
              isScanning || (images.length === 0 && !manualNotes.trim())
                ? 'bg-[#E5E7DF] text-[#607266] cursor-not-allowed'
                : 'bg-[#355E46] hover:bg-[#23402F] text-white cursor-pointer'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemma is analyzing photo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#EDAD85]" />
                <span>Identify ingredients</span>
              </>
            )}
          </button>

          <span className="text-xs text-[#607266]">or</span>

          <button
            onClick={onUseSampleIngredients}
            className="text-xs font-medium text-[#355E46] hover:underline"
          >
            Load sample ingredients (Eggs, Cheese, Spinach, Bread)
          </button>
        </div>
      </div>

      {/* Error / Alert notice */}
      {errorNotice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorNotice}</p>
            <p className="text-xs text-amber-800">
              You can still type your ingredients manually below or click "Load sample ingredients" to proceed without disruption.
            </p>
          </div>
        </div>
      )}

      {/* Manual Input Form */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-5 sm:p-6 space-y-4 shadow-xs">
        <label className="text-sm font-semibold text-[#26352B] block">
          Add or Type Ingredients Manually
        </label>

        <form onSubmit={handleAddManualIngredient} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g. Baby spinach, 4 Eggs, Sourdough bread"
            className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-[#E5E7DF] focus:outline-none focus:border-[#355E46] transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#355E46] hover:bg-[#23402F] text-white font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[#607266] uppercase tracking-wider">
            Quick additions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickSuggestions.map((item) => (
              <button
                key={item}
                onClick={() => addSuggestion(item)}
                className="px-2.5 py-1 text-xs rounded-lg bg-[#F7F6F0] hover:bg-[#DCE8D8] text-[#26352B] border border-[#E5E7DF] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#355E46]" />
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmed / Detected Ingredients List */}
      <div className="bg-white rounded-2xl border border-[#E5E7DF] p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7DF] pb-3">
          <div>
            <h3 className="font-bold text-base text-[#26352B]">
              Confirmed Ingredients ({ingredients.length})
            </h3>
            <p className="text-xs text-[#607266]">
              Review, edit estimated quantities, or remove any items.
            </p>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={() => setIngredients([])}
              className="text-xs text-rose-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="py-8 text-center text-[#607266] space-y-2">
            <p className="text-sm">No ingredients added yet.</p>
            <p className="text-xs">
              Take a fridge photo above, type items in the box, or click a quick addition.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="p-3 rounded-xl border border-[#E5E7DF] bg-[#F7F6F0]/40 hover:bg-[#F7F6F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                      className="font-semibold text-sm text-[#26352B] bg-transparent border-b border-transparent hover:border-[#E5E7DF] focus:border-[#355E46] focus:outline-none"
                    />

                    {/* Confidence badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ing.confidence === 'high'
                          ? 'bg-[#DCE8D8] text-[#355E46]'
                          : ing.confidence === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#FBEFE8] text-[#26352B]'
                      }`}
                      title={ing.notes || `Confidence: ${ing.confidence}`}
                    >
                      {ing.confidence === 'high' ? 'High Confidence' : 'Needs Verification'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#607266]">
                    <span>Qty:</span>
                    <input
                      type="text"
                      value={ing.estimatedQuantity}
                      onChange={(e) =>
                        updateIngredient(ing.id, { estimatedQuantity: e.target.value })
                      }
                      placeholder="e.g. 4 pcs, 1 cup"
                      className="text-xs text-[#26352B] bg-white px-2 py-0.5 rounded border border-[#E5E7DF] focus:outline-none focus:border-[#355E46] w-28"
                    />
                    {ing.notes && (
                      <span className="italic text-[11px] text-[#607266] truncate max-w-xs">
                        ({ing.notes})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => removeIngredient(ing.id)}
                    className="p-1.5 text-[#607266] hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                    title="Remove ingredient"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-[#E5E7DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#607266]">
            {ingredients.length > 0
              ? `Ready to plan meals with ${ingredients.length} confirmed ingredient${
                  ingredients.length > 1 ? 's' : ''
                }.`
              : 'Add at least 1 ingredient to continue.'}
          </p>

          <button
            onClick={handleProceed}
            disabled={ingredients.length === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
              ingredients.length === 0
                ? 'bg-[#E5E7DF] text-[#607266] cursor-not-allowed'
                : 'bg-[#355E46] hover:bg-[#23402F] text-white cursor-pointer'
            }`}
          >
            <span>Confirm & Set Preferences</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
