import React from 'react';
import { X, ShieldCheck, Cpu, Database, EyeOff, HeartHandshake } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-[#13241F] w-full max-w-2xl rounded-2xl border border-[#E4E8E2] dark:border-[#223D35] shadow-xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E8E2] dark:border-[#223D35] flex items-center justify-between bg-[#FAF8F1] dark:bg-[#1A3029]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087E8B] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#F5D778]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#24352F] dark:text-[#E9F4F0]">
                Open-Weight AI & Privacy Notice
              </h2>
              <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
                SlothPlate architecture, model disclosures, and privacy commitments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#586B63] dark:text-[#97ADA4] hover:text-[#24352F] dark:hover:text-white hover:bg-white dark:hover:bg-[#13241F] transition-colors cursor-pointer btn-interactive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#24352F] dark:text-[#E9F4F0] leading-relaxed">
          {/* Section 1: Open-Weight Gemma with Butter Yellow tint */}
          <div className="p-4 rounded-xl bg-[#FEF9EB] dark:bg-[#F5D778]/10 border border-[#F5D778] dark:border-[#F5D778]/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F] dark:text-[#E9F4F0]">
              <Cpu className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
              <span>Gemma 4 Open-Weight Architecture</span>
            </div>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              SlothPlate is powered by Google's open-weight Gemma model (<code className="bg-white dark:bg-[#13241F] px-2 py-0.5 rounded border border-[#E4E8E2] dark:border-[#223D35] text-[#087E8B] dark:text-[#45D6C7] font-mono font-bold">gemma-4-26b-a4b-it</code>). Gemma provides open model weights under an open license, enabling research, community inspection, and reproducible culinary logic.
            </p>
          </div>

          {/* Section 2: Hosted Inference Disclosure with Sky Blue tint */}
          <div className="p-4 rounded-xl bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#BCEBFA] dark:border-[#223D35] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F] dark:text-[#E9F4F0]">
              <Database className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
              <span>Hosted Inference & Cloud Processing</span>
            </div>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              This application uses hosted model inference through the Google GenAI SDK. When you scan fridge photos or generate meal plans, image data and culinary constraints are sent over secure HTTPS to the hosted inference endpoint for processing.
            </p>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4]">
              <strong>Notice:</strong> We do not claim that AI inference is performed locally or offline. An internet connection is required for live Gemma inference. If the API is unreachable, an offline sample mode is provided.
            </p>
          </div>

          {/* Section 3: Photo Retention & Local Storage */}
          <div className="p-4 rounded-xl bg-[#BCEBFA]/20 dark:bg-[#45D6C7]/10 border border-[#45D6C7]/50 dark:border-[#45D6C7]/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F] dark:text-[#E9F4F0]">
              <EyeOff className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
              <span>Zero Image Retention</span>
            </div>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Uploaded fridge photos are passed in-memory directly to the model endpoint. SlothPlate does not save, permanently store, or catalog your photos in any remote database. Your saved meal plans and grocery items remain strictly in your browser's <code className="bg-white dark:bg-[#13241F] px-1.5 py-0.5 rounded border border-[#E4E8E2] dark:border-[#223D35] font-mono">localStorage</code>.
            </p>
          </div>

          {/* Section 4: Why Open Weights Matter */}
          <div className="p-4 rounded-xl bg-[#FAF8F1] dark:bg-[#1A3029] border border-[#E4E8E2] dark:border-[#223D35] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F] dark:text-[#E9F4F0]">
              <HeartHandshake className="w-4 h-4 text-[#087E8B] dark:text-[#45D6C7]" />
              <span>Why the Open-Source & Open-Weight Approach Matters</span>
            </div>
            <p className="text-xs text-[#586B63] dark:text-[#97ADA4] leading-relaxed">
              Unlike proprietary black-box APIs that can change weights, deprecate features, or enforce closed vendor lock-in without notice, open-weight models allow developers and home cooks to:
            </p>
            <ul className="list-disc list-inside text-xs text-[#586B63] dark:text-[#97ADA4] space-y-1 pl-1">
              <li>Inspect and audit model safety, fine-tuning, and bias.</li>
              <li>Adapt and specialize weights for local cuisines, dietary customs, or regional pantry staples.</li>
              <li>Pave the way for true local on-device inference using Ollama, vLLM, or WebGPU in future editions.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E8E2] dark:border-[#223D35] bg-[#FAF8F1] dark:bg-[#1A3029] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#087E8B] text-white text-xs font-bold hover:bg-[#06626D] transition-colors cursor-pointer shadow-2xs btn-interactive"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
