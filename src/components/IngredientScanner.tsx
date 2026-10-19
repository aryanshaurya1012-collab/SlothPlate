import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Plus, AlertCircle, Sparkles, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle as QuestionIcon } from 'lucide-react';
import { Ingredient } from '../types';
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
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
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          base64Data,
          mimeType: file.type,
        });
      } catch (err) {
        console.error('File read error:', err);
        setErrorNotice('Could not load one of the selected images.');
      }
    }

    setImages((prev) => [...prev, ...newUploads]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Identify ingredients using open-weight Gemma endpoint
  const handleIdentifyIngredients = async () => {
    setErrorNotice(null);
    if (images.length === 0 && !manualNotes.trim()) {
      setErrorNotice('Please upload at least 1 image or type ingredients below.');
      return;
    }

    setIsScanning(true);

    try {
      const payload = {
        images: images.map((img) => ({
          base64: img.base64Data,
          mimeType: img.mimeType,
        })),
        notes: manualNotes,
      };

      const response = await fetch('/api/analyze-pantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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

  // Quick suggestion chips with coordinated palette
  const quickSuggestions = [
    { name: 'Eggs', color: 'bg-[#FEF9EB] dark:bg-[#F5D778]/15 text-[#24352F] dark:text-[#F5D778] border-[#F5D778]' },
    { name: 'Cheddar cheese', color: 'bg-[#FEF9EB] dark:bg-[#F5D778]/15 text-[#24352F] dark:text-[#F5D778] border-[#F5D778]' },
    { name: 'Spinach', color: 'bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15 text-[#087E8B] dark:text-[#45D6C7] border-[#45D6C7]' },
    { name: 'Cherry tomatoes', color: 'bg-[#FDF3F0] dark:bg-[#F28B78]/15 text-[#24352F] dark:text-[#F28B78] border-[#F28B78]' },
    { name: 'Sourdough bread', color: 'bg-[#FAF8F1] dark:bg-[#1A3029] text-[#24352F] dark:text-[#E9F4F0] border-[#E4E8E2] dark:border-[#223D35]' },
    { name: 'Garlic', color: 'bg-[#BCEBFA]/40 dark:bg-[#BCEBFA]/15 text-[#087E8B] dark:text-[#BCEBFA] border-[#BCEBFA]' },
    { name: 'Butter', color: 'bg-[#FEF9EB] dark:bg-[#F5D778]/15 text-[#24352F] dark:text-[#F5D778] border-[#F5D778]' },
    { name: 'Olive oil', color: 'bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15 text-[#087E8B] dark:text-[#45D6C7] border-[#45D6C7]' },
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
      <div className="flex items-center justify-between border-b border-[#E4E8E2] dark:border-[#223D35] pb-4">
        <div>
          <span className="text-xs font-bold text-[#087E8B] dark:text-[#45D6C7] uppercase tracking-wider">
            Step 1 of 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] dark:text-[#E9F4F0] tracking-tight">
            What's in your fridge or pantry?
          </h2>
          <p className="text-xs sm:text-sm text-[#586B63] dark:text-[#97ADA4] mt-1">
            Snap photos of your shelves or type items. You can review and adjust every detected estimate.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#E4E8E2]/40 dark:hover:bg-[#1E352F] transition-colors cursor-pointer btn-interactive"
        >
          Back
        </button>
      </div>

      {/* Image Upload Zone */}
      <div className="bg-white dark:bg-[#13241F] rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-5 sm:p-7 space-y-5 shadow-xs transition-colors duration-300">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#24352F] dark:text-[#E9F4F0] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
            Upload Fridge Photos (Max 3)
          </label>
          <span className="text-xs font-semibold text-[#586B63] dark:text-[#97ADA4] bg-[#BCEBFA]/30 dark:bg-[#45D6C7]/15 px-2.5 py-0.5 rounded-full border border-[#BCEBFA] dark:border-[#45D6C7]/30">
            {images.length}/3 uploaded • Max 5MB each
          </span>
        </div>

        {/* Upload Thumbnails & Add Button with Animated Border on Hover/Focus */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-2xl overflow-hidden border border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1] dark:bg-[#1A3029] group shadow-2xs transition-all hover:scale-[1.02]"
            >
              <img
                src={img.previewUrl}
                alt={`Fridge upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 p-1.5 bg-white/95 dark:bg-[#13241F]/90 hover:bg-white text-[#F28B78] hover:text-rose-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-[#24352F]/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                Photo {idx + 1}
              </div>
            </div>
          ))}

          {images.length < 3 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all group cursor-pointer ${
                isDraggingOver
                  ? 'border-[#087E8B] bg-[#BCEBFA]/30 upload-active-glow'
                  : 'border-[#BCEBFA] dark:border-[#45D6C7]/40 hover:border-[#087E8B] bg-[#FAF8F1] dark:bg-[#1A3029] hover:bg-[#BCEBFA]/20'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#13241F] text-[#087E8B] dark:text-[#45D6C7] border border-[#BCEBFA] dark:border-[#45D6C7]/30 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform mb-2">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#24352F] dark:text-[#E9F4F0]">
                {images.length === 0 ? 'Upload Photo' : 'Add another'}
              </span>
              <span className="text-[10px] text-[#586B63] dark:text-[#97ADA4] mt-0.5">JPEG, PNG, WebP</span>
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
          <label className="text-xs font-semibold text-[#586B63] dark:text-[#97ADA4] block mb-1.5">
            Optional notes about your fridge (e.g. "Leftover rice in plastic container, 4 eggs in door rack"):
          </label>
          <input
            type="text"
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="e.g. half block of sharp cheddar, fresh spinach in crisper"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1]/60 dark:bg-[#1A3029]/60 text-[#24352F] dark:text-[#E9F4F0] focus:bg-white dark:focus:bg-[#13241F] focus:outline-none focus:border-[#087E8B] dark:focus:border-[#45D6C7] transition-colors"
          />
        </div>

        {/* Privacy & Safety Notice */}
        <div className="p-3.5 rounded-xl bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#BCEBFA] dark:border-[#223D35] flex items-start gap-2.5 text-xs text-[#24352F] dark:text-[#E9F4F0]">
          <ShieldCheck className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Privacy note:</strong> Photos are sent to the hosted open-weight Gemma model for real-time ingredient analysis. Photos are processed in memory and are never permanently stored.
          </div>
        </div>

        {/* Scan Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={handleIdentifyIngredients}
            disabled={isScanning || (images.length === 0 && !manualNotes.trim())}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all btn-interactive ${
              isScanning || (images.length === 0 && !manualNotes.trim())
                ? 'bg-[#E4E8E2] dark:bg-[#223D35] text-[#586B63] dark:text-[#97ADA4] cursor-not-allowed'
                : 'bg-[#087E8B] hover:bg-[#06626D] text-white cursor-pointer hover:shadow'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#F5D778]" />
                <span className="animate-pulse">Gemma 4 is inspecting fridge...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F5D778]" />
                <span>Identify ingredients</span>
              </>
            )}
          </button>

          <span className="text-xs text-[#586B63] dark:text-[#97ADA4] hidden sm:inline">or</span>

          <button
            onClick={onUseSampleIngredients}
            className="text-xs font-bold text-[#087E8B] dark:text-[#45D6C7] hover:underline cursor-pointer"
          >
            Load sample ingredients (Eggs, Cheddar, Spinach, Sourdough)
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 rounded-2xl bg-[#FDF3F0] dark:bg-[#2A1715] border border-[#F28B78] text-[#24352F] dark:text-[#E9F4F0] text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-[#F28B78] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{errorNotice}</p>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
              You can still type ingredients manually below or click "Load sample ingredients" to proceed without delay.
            </p>
          </div>
        </div>
      )}

      {/* Manual Input Form */}
      <div className="bg-white dark:bg-[#13241F] rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-5 sm:p-6 space-y-4 shadow-xs">
        <label className="text-sm font-bold text-[#24352F] dark:text-[#E9F4F0] block">
          Add or Type Ingredients Manually
        </label>

        <form onSubmit={handleAddManualIngredient} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g. Baby spinach, 4 Eggs, Sharp cheddar, Sourdough"
            className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-[#E4E8E2] dark:border-[#223D35] bg-white dark:bg-[#1A3029] text-[#24352F] dark:text-[#E9F4F0] focus:outline-none focus:border-[#087E8B] dark:focus:border-[#45D6C7] transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#087E8B] hover:bg-[#06626D] text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs btn-interactive"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick Suggestion Chips with playful hover scale */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#586B63] dark:text-[#97ADA4] uppercase tracking-wider block">
            Quick additions:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((item) => (
              <button
                key={item.name}
                onClick={() => addSuggestion(item.name)}
                className={`px-3 py-1 text-xs rounded-xl font-medium border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-interactive ${item.color}`}
              >
                <Plus className="w-3 h-3 text-[#087E8B] dark:text-[#45D6C7]" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmed / Detected Ingredients List */}
      <div className="bg-white dark:bg-[#13241F] rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E4E8E2] dark:border-[#223D35] pb-3.5">
          <div>
            <h3 className="font-extrabold text-base text-[#24352F] dark:text-[#E9F4F0]">
              Confirmed Ingredients ({ingredients.length})
            </h3>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
              Review, edit estimated quantities, or remove items before generating meals.
            </p>
          </div>
          {ingredients.length > 0 && (
            <button
              onClick={() => setIngredients([])}
              className="text-xs font-semibold text-[#F28B78] hover:text-rose-700 hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="py-10 text-center text-[#586B63] dark:text-[#97ADA4] space-y-2">
            <p className="text-sm font-semibold text-[#24352F] dark:text-[#E9F4F0]">No ingredients added yet.</p>
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
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 card-interactive ${
                    isHigh
                      ? 'bg-[#BCEBFA]/20 dark:bg-[#45D6C7]/10 border-[#45D6C7]/50 hover:border-[#087E8B]'
                      : 'bg-[#FEF9EB] dark:bg-[#F5D778]/10 border-[#F5D778] hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                        className="font-bold text-sm text-[#24352F] dark:text-[#E9F4F0] bg-transparent border-b border-transparent hover:border-[#E4E8E2] dark:hover:border-[#223D35] focus:border-[#087E8B] dark:focus:border-[#45D6C7] focus:outline-none w-full"
                      />
                    </div>

                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="p-1 text-[#586B63] dark:text-[#97ADA4] hover:text-[#F28B78] rounded-lg hover:bg-white dark:hover:bg-[#1A3029] transition-colors cursor-pointer shrink-0"
                      title="Remove ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#586B63] dark:text-[#97ADA4] font-medium text-[11px]">Qty:</span>
                      <input
                        type="text"
                        value={ing.estimatedQuantity}
                        onChange={(e) =>
                          updateIngredient(ing.id, { estimatedQuantity: e.target.value })
                        }
                        placeholder="e.g. 4 pcs, 1 cup"
                        className="text-xs font-semibold text-[#24352F] dark:text-[#E9F4F0] bg-white dark:bg-[#1A3029] px-2 py-0.5 rounded-md border border-[#E4E8E2] dark:border-[#223D35] focus:outline-none focus:border-[#087E8B] dark:focus:border-[#45D6C7] w-24"
                      />
                    </div>

                    {/* Subtle Confidence Indicator Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isHigh
                          ? 'bg-white dark:bg-[#13241F] text-[#087E8B] dark:text-[#45D6C7] border border-[#45D6C7]/50'
                          : 'bg-white dark:bg-[#13241F] text-[#24352F] dark:text-[#E9F4F0] border border-[#F5D778]'
                      }`}
                      title={ing.notes || `Confidence: ${ing.confidence}`}
                    >
                      {isHigh ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-[#45D6C7]" />
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
        <div className="pt-4 border-t border-[#E4E8E2] dark:border-[#223D35] flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
            {ingredients.length > 0
              ? `Ready to plan meals with ${ingredients.length} confirmed ingredient${
                  ingredients.length > 1 ? 's' : ''
                }.`
              : 'Add at least 1 ingredient to continue.'}
          </p>

          <button
            onClick={handleProceed}
            disabled={ingredients.length === 0}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all btn-interactive ${
              ingredients.length === 0
                ? 'bg-[#E4E8E2] dark:bg-[#223D35] text-[#586B63] dark:text-[#97ADA4] cursor-not-allowed'
                : 'bg-[#087E8B] hover:bg-[#06626D] text-white cursor-pointer hover:shadow'
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
