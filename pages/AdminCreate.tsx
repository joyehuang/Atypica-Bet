
import React, { useState } from 'react';
import { Category, PredictionOption, PredictionMarket, PredictionStatus } from '../types';
import { generatePredictionAnalysis, parseAnalysis } from '../services/geminiService';
import { ChevronLeft, Plus, X, Sparkles, Loader2, Save } from 'lucide-react';

interface AdminCreateProps {
  onBack: () => void;
  onSave: (market: PredictionMarket) => void;
}

export const AdminCreate: React.FC<AdminCreateProps> = ({ onBack, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.TECH,
    closeDate: '',
    options: [{ text: '', externalProb: 0.5 }, { text: '', externalProb: 0.5 }]
  });

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, { text: '', externalProb: 0 }] });
  };

  const handleRemoveOption = (index: number) => {
    const newOpts = [...formData.options];
    newOpts.splice(index, 1);
    setFormData({ ...formData, options: newOpts });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOpts = [...formData.options];
    (newOpts[index] as any)[field] = value;
    setFormData({ ...formData, options: newOpts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Call Gemini to generate analysis
    const optionTexts = formData.options.map(o => o.text);
    const analysisText = await generatePredictionAnalysis(formData.title, formData.description, optionTexts);
    
    let atypicaPickId = '';
    let atypicaAnalysis = '';
    let accuracyScore = 0.5;

    if (analysisText) {
      const parsed = parseAnalysis(analysisText);
      // Find the index of the picked option
      const pickedIdx = optionTexts.findIndex(t => parsed.pick.toLowerCase().includes(t.toLowerCase()));
      atypicaAnalysis = parsed.reasoning;
      accuracyScore = parsed.score / 100;
      
      // Update options with AI probability (simplified logic for demo)
      const optionsWithAI: PredictionOption[] = formData.options.map((o, idx) => ({
        id: `opt-${Math.random().toString(36).substr(2, 9)}`,
        text: o.text,
        externalProb: o.externalProb,
        atypicaProb: idx === pickedIdx ? 0.7 : 0.3 / (formData.options.length - 1)
      }));

      atypicaPickId = optionsWithAI[pickedIdx === -1 ? 0 : pickedIdx].id;

      const newMarket: PredictionMarket = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        closeDate: formData.closeDate,
        status: PredictionStatus.ACTIVE,
        options: optionsWithAI,
        atypicaPickId,
        atypicaAnalysis,
        accuracyScore,
        shareCount: 0,
        viewCount: 0
      };

      onSave(newMarket);
    } else {
      alert("AI 分析生成失败，请检查 API KEY 配置。");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        返回列表
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-8">创建新预测市场</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">预测标题</label>
            <input 
              required
              placeholder="例如: 2026年最佳AI模型公司是？"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">详细描述</label>
            <textarea 
              required
              rows={4}
              placeholder="提供关于该预测话题的背景信息..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">分类</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.entries(Category).map(([key, val]) => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">截止日期</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none"
                value={formData.closeDate}
                onChange={e => setFormData({ ...formData, closeDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">预测选项与外部概率</label>
              <button 
                type="button"
                onClick={handleAddOption}
                className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> 添加选项
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input 
                    required
                    placeholder={`选项 ${idx + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    value={opt.text}
                    onChange={e => handleOptionChange(idx, 'text', e.target.value)}
                  />
                  <div className="w-24 relative">
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="概率"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none pr-8"
                      value={opt.externalProb}
                      onChange={e => handleOptionChange(idx, 'externalProb', parseFloat(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
                  </div>
                  {formData.options.length > 2 && (
                    <button type="button" onClick={() => handleRemoveOption(idx)} className="p-2 text-slate-300 hover:text-danger">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在调用 AI 生成深度分析报告...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-primary" />
                生成预测并保存
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
