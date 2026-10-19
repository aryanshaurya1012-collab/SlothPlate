import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, RefreshCw, ShieldCheck } from 'lucide-react';
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
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7DF] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7DF] flex items-center justify-between bg-[#F7F6F0]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#355E46] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#26352B]">
                Quality & Diagnostic Checks
              </h2>
              <p className="text-xs text-[#607266]">
                Automated programmatic test execution for Hacktoberfest 2026 guidelines.
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

        {/* Summary Banner */}
        <div className="p-4 bg-[#F7F6F0] border-b border-[#E5E7DF] flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#355E46]">
                <CheckCircle2 className="w-4 h-4" />
                All {totalCount} Verification Tests Passed
              </span>
            ) : (
              <span className="font-semibold text-[#26352B]">
                {passedCount} of {totalCount} tests passed
              </span>
            )}
            {lastExecuted && (
              <span className="text-[11px] text-[#607266] hidden sm:inline">
                (Executed at {lastExecuted})
              </span>
            )}
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="px-3 py-1.5 bg-white border border-[#E5E7DF] hover:border-[#355E46]/40 text-[#26352B] font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-[#355E46]' : ''}`} />
            <span>Re-run Suite</span>
          </button>
        </div>

        {/* Test items list */}
        <div className="p-5 overflow-y-auto space-y-3">
          {results.map((test) => (
            <div
              key={test.id}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm space-y-1.5 transition-colors ${
                test.passed
                  ? 'bg-white border-[#E5E7DF]'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#355E46] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#607266] tracking-wider block">
                      {test.category}
                    </span>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#26352B]">
                      {test.name}
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    test.passed
                      ? 'bg-[#DCE8D8] text-[#355E46]'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {test.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <p className="text-xs text-[#607266] pl-6 leading-relaxed">
                {test.message}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7DF] bg-[#F7F6F0]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#355E46] text-white text-xs font-semibold hover:bg-[#23402F] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
