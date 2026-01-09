import React from 'react';
import DiceHexagon from './DiceHexagon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                <DiceHexagon className="text-black w-3 h-3 fill-current" />
              </div>
              <span className="font-bold text-white uppercase tracking-tighter text-xs">Atypica Bet</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed font-medium uppercase tracking-widest max-w-xs">
              Objective predictive intelligence <br /> Powered by mathematical certainty.
            </p>
          </div>
          {['Engine', 'Network', 'Connect'].map((title, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">{title}</h4>
              <ul className="space-y-3 text-[10px] text-muted font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Core API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Paper</a></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[9px] text-muted font-bold uppercase tracking-widest">© 2024 ATYPICA SYSTEM. NO RIGHTS RESERVED BY MACHINES.</span>
          <div className="flex gap-8">
            <a href="#" className="text-[9px] text-muted font-bold uppercase tracking-widest hover:text-white">Security</a>
            <a href="#" className="text-[9px] text-muted font-bold uppercase tracking-widest hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
