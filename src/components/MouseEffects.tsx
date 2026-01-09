'use client';

import { useEffect } from 'react';

export default function MouseEffects() {
  useEffect(() => {
    // 创建背景动态元素
    const bgEffect = document.createElement('div');
    bgEffect.classList.add('mouse-follow-bg');
    document.body.appendChild(bgEffect);

    // 监听鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      requestAnimationFrame(() => {
        bgEffect.style.left = `${mouseX}px`;
        bgEffect.style.top = `${mouseY}px`;
        bgEffect.style.opacity = '1';
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    // 卡片光效跟踪
    const trackMouseOnCards = () => {
      const cards = document.querySelectorAll('.spotlight-card');

      cards.forEach(card => {
        const handleCardMouseMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left;
          const y = mouseEvent.clientY - rect.top;

          (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
          (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        };

        const handleCardMouseLeave = () => {
          (card as HTMLElement).style.setProperty('--mouse-x', '50%');
          (card as HTMLElement).style.setProperty('--mouse-y', '50%');
        };

        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
      });
    };

    // 执行初始化
    trackMouseOnCards();

    // 对于动态加载的卡片，定期检查并添加事件监听
    const interval = setInterval(trackMouseOnCards, 2000);

    // 清理
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
      bgEffect.remove();
    };
  }, []);

  return null;
}
