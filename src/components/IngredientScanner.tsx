import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Plus, AlertCircle, Sparkles, Check, HelpCircle, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle as QuestionIcon } from 'lucide-react';
import { ConfidenceLevel, Ingredient } from '../types';
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

      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
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

  // Quick suggestion chips with varied pastel colors
  const quickSuggestions = [
    { name: 'Eggs', color: 'bg-[#FEF9EB] text-[#26342D] border-[#F4CF77]' },
    { name: 'Cheddar cheese', color: 'bg-[#FEF9EB] text-[#26342D] border-[#F4CF77]' },
    { name: 'Spinach', color: 'bg-[#F0F5F0] text-[#285943] border-[#78A878]' },
    { name: 'Cherry tomatoes', color: 'bg-[#FDF3F0] text-[#26342D] border-[#E98B70]' },
    { name: 'Sourdough bread', color: 'bg-[#FAF8F1] text-[#26342D] border-[#E8E6DC]' },
    { name: 'Garlic', color: 'bg-[#F2F8FA] text-[#285943] border-[#BFDDE8]' },
    { name: 'Butter', color: 'bg-[#FEF9EB] text-[#26342D] border-[#F4CF77]' },
    { name: 'Olive oil', color: 'bg-[#F0F5F0] text-[#285943] border-[#78A878]' },
  ];

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
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-7">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6DC] pb-4">
        <div>
          <span className="text-xs font-bold text-[#285943] uppercase tracking-wider">
            Step 1 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26342D] tracking-tight">
            What's in your fridge or pantry?
          </h2>
          <p className="text-xs sm:text-sm text-[#66746B] mt-1">
            Snap photos of your shelves or type items. You can review and adjust every detected estimate.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-[#66746B] hover:text-[#26342D] px-3 py-1.5 rounded-xl hover:bg-[#E8E6DC]/40 transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* Image Upload Zone with Pale Mint / Powder Blue tint */}
      <div className="bg-white rounded-2xl border border-[#E8E6DC] p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#26342D] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#285943]" />
            Upload Fridge Photos (Max 3)
          </label>
          <span className="text-xs font-semibold text-[#66746B] bg-[#F2F8FA] px-2.5 py-0.5 rounded-full border border-[#BFDDE8]">
            {images.length}/3 uploaded • Max 5MB each
          </span>
        </div>

        {/* Upload Thumbnails & Add Button */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8E6DC] bg-[#FAF8F1] group shadow-2xs"
            >
              <img
                src={img.previewUrl}
                alt={`Fridge upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 p-1.5 bg-white/95 hover:bg-white text-[#E98B70] hover:text-rose-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-[#26342D]/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                Photo {idx + 1}
              </div>
            </div>
          ))}

          {images.length < 3 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-[#BFDDE8] hover:border-[#285943] bg-[#F2F8FA] hover:bg-[#FAF8F1] flex flex-col items-center justify-center p-3 text-center transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#285943] border border-[#BFDDE8] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform mb-2">
                <Upload className="w-4 h-4 text-[#285943]" />
              </div>
              <span className="text-xs font-bold text-[#26342D]">
                {images.length === 0 ? 'Upload Photo' : 'Add another'}
              </span>
              <span className="text-[10px] text-[#66746B] mt-0.5">JPEG, PNG, WebP</span>
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
          <label className="text-xs font-semibold text-[#66746B] block mb-1.5">
            Optional notes about your fridge (e.g. "Leftover rice in plastic container, 4 eggs in door rack"):
          </label>
          <input
            type="text"
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="e.g. half block of sharp cheddar, fresh spinach in crisper"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E6DC] bg-[#FAF8F1]/60 focus:bg-white focus:outline-none focus:border-[#285943] transition-colors"
          />
        </div>

        {/* Privacy & Safety Notice with Powder Blue tint */}
        <div className="p-3.5 rounded-xl bg-[#F2F8FA] border border-[#BFDDE8] flex items-start gap-2.5 text-xs text-[#26342D]">
          <ShieldCheck className="w-4 h-4 text-[#285943] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#26342D]">Privacy note:</strong> Photos are sent to the hosted open-weight Gemma model for real-time ingredient analysis. Photos are processed in memory and are never permanently stored.
          </div>
        </div>

        {/* Scan Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={handleIdentifyIngredients}
            disabled={isScanning || (images.length === 0 && !manualNotes.trim())}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
              isScanning || (images.length === 0 && !manualNotes.trim())
                ? 'bg-[#E8E6DC] text-[#66746B] cursor-not-allowed'
                : 'bg-[#285943] hover:bg-[#1E4332] text-white cursor-pointer hover:shadow'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#F4CF77]" />
                <span>Gemma 4 is inspecting fridge...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F4CF77]" />
                <span>Identify ingredients</span>
              </>
            )}
          </button>

          <span className="text-xs text-[#66746B] hidden sm:inline">or</span>

          <button
            onClick={onUseSampleIngredients}
            className="text-xs font-bold text-[#285943] hover:underline cursor-pointer"
          >
            Load sample ingredients (Eggs, Cheddar, Spinach, Sourdough)
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 rounded-2xl bg-[#FDF3F0] border border-[#E98B70] text-[#26342D] text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-[#E98B70] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{errorNotice}</p>
            <p className="text-xs text-[#66746B]">
              You can still type ingredients manually below or click "Load sample ingredients" to proceed without delay.
            </p>
          </div>
        </div>
      )}

      {/* Manual Input Form */}
      <div className="bg-white rounded-2xl border border-[#E8E6DC] p-5 sm:p-6 space-y-4 shadow-xs">
        <label className="text-sm font-bold text-[#26342D] block">
          Add or Type Ingredients Manually
        </label>

        <form onSubmit={handleAddManualIngredient} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g. Baby spinach, 4 Eggs, Sharp cheddar, Sourdough"
            className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-[#E8E6DC] focus:outline-none focus:border-[#285943] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1E4332] text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#66746B] uppercase tracking-wider block">
            Quick additions:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((item) => (
              <button
                key={item.name}
                onClick={() => addSuggestion(item.name)}
                className={`px-3 py-1 text-xs rounded-xl font-medium border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102 ${item.color}`}
              >
                <Plus className="w-3 h-3 text-[#285943]" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmed / Detected Ingredients List */}
      <div className="bg-white rounded-2xl border border-[#E8E6DC] p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8E6DC] pb-3.5">
          <div>
            <h3 className="font-extrabold text-base text-[#26342D]">
              Confirmed Ingredients ({ingredients.length})
            </h3>
            <p className="text-xs text-[#66746B]">
              Review, edit estimated quantities, or remove items before generating meals.
            </p>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={() => setIngredients([])}
              className="text-xs font-semibold text-[#E98B70] hover:text-rose-700 hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="py-10 text-center text-[#66746B] space-y-2">
            <p className="text-sm font-semibold text-[#26342D]">No ingredients added yet.</p>
            <p className="text-xs">
              Upload a fridge photo above, type items in the box, or click a quick suggestion.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ingredients.map((ing) => {
              const isHigh = ing.confidence === 'high';
              return (
                <div
                  key={ing.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                    isHigh
                      ? 'bg-[#F0F5F0] border-[#78A878]/40 hover:border-[#78A878]'
                      : 'bg-[#FEF9EB] border-[#F4CF77] hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                        className="font-bold text-sm text-[#26342D] bg-transparent border-b border-transparent hover:border-[#E8E6DC] focus:border-[#285943] focus:outline-none w-full"
                      />
                    </div>

                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="p-1 text-[#66746B] hover:text-[#E98B70] rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0"
                      title="Remove ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#66746B] font-medium text-[11px]">Qty:</span>
                      <input
                        type="text"
                        value={ing.estimatedQuantity}
                        onChange={(e) =>
                          updateIngredient(ing.id, { estimatedQuantity: e.target.value })
                        }
                        placeholder="e.g. 4 pcs, 1 cup"
                        className="text-xs font-semibold text-[#26342D] bg-white px-2 py-0.5 rounded-md border border-[#E8E6DC] focus:outline-none focus:border-[#285943] w-24"
                      />
                    </div>

                    {/* Subtle Confidence Indicator Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isHigh
                          ? 'bg-white text-[#285943] border border-[#78A878]/40'
                          : 'bg-white text-[#26342D] border border-[#F4CF77]'
                      }`}
                      title={ing.notes || `Confidence: ${ing.confidence}`}
                    >
                      {isHigh ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#78A878]" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <QuestionIcon className="w-3 h-3 text-amber-600" />
                          <span>Verify</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-[#E8E6DC] flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <p className="text-xs text-[#66746B]">
            {ingredients.length > 0
              ? `Ready to plan meals with ${ingredients.length} confirmed ingredient${
                  ingredients.length > 1 ? 's' : ''
                }.`
              : 'Add at least 1 ingredient to continue.'}
          </p>

          <button
            onClick={handleProceed}
            disabled={ingredients.length === 0}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
              ingredients.length === 0
                ? 'bg-[#E8E6DC] text-[#66746B] cursor-not-allowed'
                : 'bg-[#285943] hover:bg-[#1E4332] text-white cursor-pointer hover:shadow'
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
