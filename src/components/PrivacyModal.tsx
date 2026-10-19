import React from 'react';
import { X, ShieldCheck, Cpu, Database, EyeOff, Lock, HeartHandshake } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7DF] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7DF] flex items-center justify-between bg-[#F7F6F0]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#355E46] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#26352B]">
                Open-Weight AI & Privacy Notice
              </h2>
              <p className="text-xs text-[#607266]">
                SlothPlate architecture, model disclosures, and data practices.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#607266] hover:text-[#26352B] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#26352B] leading-relaxed">
          {/* Section 1: Open-Weight Gemma */}
          <div className="p-4 rounded-xl bg-[#F7F6F0] border border-[#E5E7DF] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#355E46]">
              <Cpu className="w-4 h-4" />
              <span>Gemma 4 Open-Weight Architecture</span>
            </div>
            <p className="text-xs text-[#607266]">
              SlothPlate is powered by Google's open-weight Gemma model (<code className="bg-white px-1.5 py-0.5 rounded border border-[#E5E7DF] text-[#26352B] font-mono">gemma-4-26b-a4b-it</code>). Gemma provides open model weights under an open license, enabling research, community inspection, and reproducible culinary logic.
            </p>
          </div>

          {/* Section 2: Hosted Inference Disclosure */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#26352B] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#355E46]" />
              Hosted Inference & Cloud Processing
            </h3>
            <p className="text-xs text-[#607266]">
              This MVP implementation uses hosted model inference through the Google GenAI SDK. When you click "Identify ingredients" or "Generate meal suggestions", image data and user preferences are sent over secure HTTPS to the hosted model inference endpoint for processing.
            </p>
            <p className="text-xs text-[#607266]">
              <strong>Notice:</strong> We do not claim that AI generation operates entirely offline or on-device. An internet connection is required for live Gemma inference. If the API is unreachable, an offline sample mode is provided.
            </p>
          </div>

          {/* Section 3: Photo Retention & Local Storage */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#26352B] flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#355E46]" />
              Zero Image Retention
            </h3>
            <p className="text-xs text-[#607266]">
              Uploaded fridge photos are passed in-memory directly to the model endpoint. SlothPlate does not save, permanently store, or catalog your photos in any remote database. Your saved recipes, ingredient lists, and grocery items remain strictly in your browser's <code className="bg-[#F7F6F0] px-1 py-0.5 rounded border border-[#E5E7DF]">localStorage</code>.
            </p>
          </div>

          {/* Section 4: Why Open Weights Matter */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#26352B] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#355E46]" />
              Why the Open-Source & Open-Weight Approach Matters
            </h3>
            <p className="text-xs text-[#607266]">
              Unlike proprietary black-box APIs that can change weights, deprecate features, or enforce closed vendor lock-in without notice, open-weight models allow developers and home cooks to:
            </p>
            <ul className="list-disc list-inside text-xs text-[#607266] space-y-1 pl-1">
              <li>Inspect and audit model safety, fine-tuning, and bias.</li>
              <li>Adapt and specialize weights for local cuisines, dietary customs, or regional pantry staples.</li>
              <li>Pave the way for true local on-device inference using Ollama, vLLM, or WebGPU in future editions.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7DF] bg-[#F7F6F0]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#355E46] text-white text-xs font-semibold hover:bg-[#23402F] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
