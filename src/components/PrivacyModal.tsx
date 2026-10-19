import React from 'react';
import { X, ShieldCheck, Cpu, Database, EyeOff, HeartHandshake } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E4E8E2] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E8E2] flex items-center justify-between bg-[#FAF8F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087E8B] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#F5D778]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#24352F]">
                Open-Weight AI & Privacy Notice
              </h2>
              <p className="text-xs text-[#586B63]">
                SlothPlate architecture, model disclosures, and privacy commitments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#586B63] hover:text-[#24352F] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#24352F] leading-relaxed">
          {/* Section 1: Open-Weight Gemma with Butter Yellow tint */}
          <div className="p-4 rounded-xl bg-[#FEF9EB] border border-[#F5D778] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F]">
              <Cpu className="w-4 h-4 text-[#087E8B]" />
              <span>Gemma 4 Open-Weight Architecture</span>
            </div>
            <p className="text-xs text-[#586B63] leading-relaxed">
              SlothPlate is powered by Google's open-weight Gemma model (<code className="bg-white px-2 py-0.5 rounded border border-[#E4E8E2] text-[#087E8B] font-mono font-bold">gemma-4-26b-a4b-it</code>). Gemma provides open model weights under an open license, enabling research, community inspection, and reproducible culinary logic.
            </p>
          </div>

          {/* Section 2: Hosted Inference Disclosure with Sky Blue tint */}
          <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#BCEBFA] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F]">
              <Database className="w-4 h-4 text-[#087E8B]" />
              <span>Hosted Inference & Cloud Processing</span>
            </div>
            <p className="text-xs text-[#586B63] leading-relaxed">
              This application uses hosted model inference through the Google GenAI SDK. When you scan fridge photos or generate meal plans, image data and culinary constraints are sent over secure HTTPS to the hosted inference endpoint for processing.
            </p>
            <p className="text-xs text-[#586B63]">
              <strong>Notice:</strong> We do not claim that AI inference is performed locally or offline. An internet connection is required for live Gemma inference. If the API is unreachable, an offline sample mode is provided.
            </p>
          </div>

          {/* Section 3: Photo Retention & Local Storage */}
          <div className="p-4 rounded-xl bg-[#BCEBFA]/20 border border-[#45D6C7]/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F]">
              <EyeOff className="w-4 h-4 text-[#087E8B]" />
              <span>Zero Image Retention</span>
            </div>
            <p className="text-xs text-[#586B63] leading-relaxed">
              Uploaded fridge photos are passed in-memory directly to the model endpoint. SlothPlate does not save, permanently store, or catalog your photos in any remote database. Your saved meal plans and grocery items remain strictly in your browser's <code className="bg-white px-1.5 py-0.5 rounded border border-[#E4E8E2] font-mono">localStorage</code>.
            </p>
          </div>

          {/* Section 4: Why Open Weights Matter */}
          <div className="p-4 rounded-xl bg-[#FAF8F1] border border-[#E4E8E2] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#24352F]">
              <HeartHandshake className="w-4 h-4 text-[#087E8B]" />
              <span>Why the Open-Source & Open-Weight Approach Matters</span>
            </div>
            <p className="text-xs text-[#586B63] leading-relaxed">
              Unlike proprietary black-box APIs that can change weights, deprecate features, or enforce closed vendor lock-in without notice, open-weight models allow developers and home cooks to:
            </p>
            <ul className="list-disc list-inside text-xs text-[#586B63] space-y-1 pl-1">
              <li>Inspect and audit model safety, fine-tuning, and bias.</li>
              <li>Adapt and specialize weights for local cuisines, dietary customs, or regional pantry staples.</li>
              <li>Pave the way for true local on-device inference using Ollama, vLLM, or WebGPU in future editions.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E8E2] bg-[#FAF8F1] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#087E8B] text-white text-xs font-bold hover:bg-[#06626D] transition-colors cursor-pointer shadow-2xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
