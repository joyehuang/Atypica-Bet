
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
      case PredictionStatus.ACTIVE: return 'text-blue-400 bg-blue-500/10';
      case PredictionStatus.CLOSED: return 'text-amber-400 bg-amber-500/10';
      case PredictionStatus.SUCCESSFUL: return 'text-emerald-400 bg-emerald-500/10';
      case PredictionStatus.FAILED: return 'text-rose-400 bg-rose-500/10';
      default: return 'text-white/50 bg-white/5';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">预测管理后台</h1>
          <p className="text-white/60 mt-1">管理、分析并结算预测市场</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          创建预测
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-black text-white/60 uppercase tracking-widest">标题与分类</th>
              <th className="px-6 py-4 text-xs font-black text-white/60 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-xs font-black text-white/60 uppercase tracking-widest">截止日期</th>
              <th className="px-6 py-4 text-xs font-black text-white/60 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(m => (
              <React.Fragment key={m.id}>
                <tr className={`border-b border-white/10 hover:bg-white/5 transition-colors ${expandedId === m.id ? 'bg-white/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1">{m.title}</div>
                    <span className="text-[10px] font-black text-white/50 uppercase px-1.5 py-0.5 rounded border border-white/20">
                      {CATEGORY_LABELS[m.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(m.status)}`}>
                      {STATUS_LABELS[m.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60 font-medium">{m.closeDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        {expandedId === m.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <button className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === m.id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 bg-black/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-black text-white/60 uppercase mb-4 tracking-widest">选项结算 (仅针对已结束预测)</h4>
                          <div className="space-y-2">
                            {m.options.map(opt => (
                              <div key={opt.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                  {opt.text}
                                  {m.atypicaPickId === opt.id && <span className="text-[10px] bg-primary/20 text-secondary px-1.5 py-0.5 rounded">AI 推荐</span>}
                                  {opt.isWinner && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                                </span>
                                <button
                                  disabled={m.status === PredictionStatus.SUCCESSFUL || m.status === PredictionStatus.FAILED}
                                  onClick={() => onResolve(m.id, opt.id)}
                                  className="text-xs font-bold text-primary hover:underline disabled:opacity-30 disabled:no-underline"
                                >
                                  标记为获胜者
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <h4 className="text-xs font-black text-white/60 uppercase mb-4 tracking-widest">Atypica 分析统计</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                               <div className="text-2xl font-black text-white">{m.viewCount}</div>
                               <div className="text-[10px] text-white/50 font-bold uppercase">浏览量</div>
                            </div>
                            <div>
                               <div className="text-2xl font-black text-white">{m.shareCount}</div>
                               <div className="text-[10px] text-white/50 font-bold uppercase">分享数</div>
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
