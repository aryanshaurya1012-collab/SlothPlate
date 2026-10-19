import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { runAllQualityChecks, TestResult } from '../utils/tests';

interface QualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityModal: React.FC<QualityModalProps> = ({ isOpen, onClose }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const suiteResults = runAllQualityChecks();
      setResults(suiteResults);
      setIsRunning(false);
      setLastExecuted(new Date().toLocaleTimeString());
    }, 150);
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E4E8E2] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E4E8E2] flex items-center justify-between bg-[#FAF8F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087E8B] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#45D6C7]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#24352F]">
                Quality & Diagnostic Checks
              </h2>
              <p className="text-xs text-[#586B63]">
                Automated programmatic test execution for Hacktoberfest 2026 guidelines.
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

        {/* Summary Banner */}
        <div className="p-4 bg-[#BCEBFA]/20 border-b border-[#45D6C7]/30 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#087E8B]">
                <CheckCircle2 className="w-4 h-4 text-[#45D6C7]" />
                All {totalCount} Verification Tests Passed
              </span>
            ) : (
              <span className="font-bold text-[#24352F]">
                {passedCount} of {totalCount} tests passed
              </span>
            )}
            {lastExecuted && (
              <span className="text-[11px] text-[#586B63] hidden sm:inline">
                (Executed at {lastExecuted})
              </span>
            )}
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="px-3.5 py-1.5 bg-white border border-[#E4E8E2] hover:border-[#087E8B]/40 text-[#24352F] font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-[#087E8B]' : ''}`} />
            <span>Re-run Suite</span>
          </button>
        </div>

        {/* Test items list */}
        <div className="p-5 overflow-y-auto space-y-3">
          {results.map((test) => (
            <div
              key={test.id}
              className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 transition-all ${
                test.passed
                  ? 'bg-white border-[#E4E8E2]'
                  : 'bg-[#FDF3F0] border-[#F28B78]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#45D6C7] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#F28B78] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#586B63] tracking-wider block">
                      {test.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#24352F]">
                      {test.name}
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    test.passed
                      ? 'bg-[#BCEBFA]/30 text-[#087E8B] border border-[#45D6C7]/40'
                      : 'bg-[#FDF3F0] text-[#F28B78] border border-[#F28B78]'
                  }`}
                >
                  {test.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <p className="text-xs text-[#586B63] pl-6.5 leading-relaxed">
                {test.message}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E4E8E2] bg-[#FAF8F1] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#087E8B] text-white text-xs font-bold hover:bg-[#06626D] transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
