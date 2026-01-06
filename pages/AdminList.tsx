
import React from 'react';
import { PredictionMarket, PredictionStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../constants';
import { Plus, Edit2, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AdminListProps {
  markets: PredictionMarket[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onResolve: (id: string, winnerId: string) => void;
}

export const AdminList: React.FC<AdminListProps> = ({ markets, onAdd, onDelete, onResolve }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const getStatusColor = (status: PredictionStatus) => {
    switch(status) {
      case PredictionStatus.ACTIVE: return 'text-blue-600 bg-blue-50';
      case PredictionStatus.CLOSED: return 'text-amber-600 bg-amber-50';
      case PredictionStatus.SUCCESSFUL: return 'text-emerald-600 bg-emerald-50';
      case PredictionStatus.FAILED: return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">预测管理后台</h1>
          <p className="text-slate-500 mt-1">管理、分析并结算预测市场</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-primary hover:bg-secondary text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          创建预测
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">标题与分类</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">截止日期</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(m => (
              <React.Fragment key={m.id}>
                <tr className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${expandedId === m.id ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 mb-1">{m.title}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase px-1.5 py-0.5 rounded border border-slate-200">
                      {CATEGORY_LABELS[m.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(m.status)}`}>
                      {STATUS_LABELS[m.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{m.closeDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        {expandedId === m.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <button className="p-2 text-slate-400 hover:text-brandBlue hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onDelete(m.id)}
                        className="p-2 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === m.id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 bg-slate-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">选项结算 (仅针对已结束预测)</h4>
                          <div className="space-y-2">
                            {m.options.map(opt => (
                              <div key={opt.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                  {opt.text}
                                  {m.atypicaPickId === opt.id && <span className="text-[10px] bg-primary/20 text-secondary px-1.5 py-0.5 rounded">AI 推荐</span>}
                                  {opt.isWinner && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                                </span>
                                <button 
                                  disabled={m.status === PredictionStatus.SUCCESSFUL || m.status === PredictionStatus.FAILED}
                                  onClick={() => onResolve(m.id, opt.id)}
                                  className="text-xs font-bold text-secondary hover:underline disabled:opacity-30 disabled:no-underline"
                                >
                                  标记为获胜者
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Atypica 分析统计</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                               <div className="text-2xl font-black text-slate-800">{m.viewCount}</div>
                               <div className="text-[10px] text-slate-400 font-bold uppercase">浏览量</div>
                            </div>
                            <div>
                               <div className="text-2xl font-black text-slate-800">{m.shareCount}</div>
                               <div className="text-[10px] text-slate-400 font-bold uppercase">分享数</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
