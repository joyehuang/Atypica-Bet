import { useEffect, useRef } from 'react';

interface IOptions {
  light?: {
    width?: number; // 宽
    height?: number; // 高
    color?: string; // 颜色
    blur?: number; // filter: blur()
  };
}

export const useLightCard = (option: IOptions = {}) => {
  // 获取卡片的dom节点
  const cardRef = useRef<HTMLDivElement | null>(null);
  let cardOverflow = '';
  // 光的dom节点 - 初始化为 null，在客户端才创建
  const lightRef = useRef<HTMLDivElement | null>(null);
  
  // 创建光源 DOM 元素（仅在客户端）
  const createLightElement = (): HTMLDivElement => {
    if (!lightRef.current && typeof document !== 'undefined') {
      lightRef.current = document.createElement('div');
    }
    return lightRef.current!;
  };
  
  // 设置光源的样式
  const setLightStyle = () => {
    if (typeof document === 'undefined') return;
    const { width = 80, height = 80, color = 'rgba(255, 179, 71, 0.1)', blur = 50 } = option.light ?? {};
    const lightDom = createLightElement();
    if (!lightDom) return;
    lightDom.style.position = 'absolute';
    lightDom.style.width = `${width}px`;
    lightDom.style.height = `${height}px`;
    lightDom.style.background = color;
    lightDom.style.filter = `blur(${blur}px)`;
    lightDom.style.borderRadius = '50%';
    lightDom.style.pointerEvents = 'none';
    lightDom.style.zIndex = '1';
    lightDom.style.opacity = '0';
    lightDom.style.transition = 'opacity 0.3s ease-out';
  };

  // 设置卡片的 overflow 为 hidden
  const setCardOverflowHidden = () => {
    const cardDom = cardRef.current;
    if (cardDom) {
      cardOverflow = cardDom.style.overflow;
      cardDom.style.overflow = 'hidden';
    }
  };
  
  // 还原卡片的 overflow
  const restoreCardOverflow = () => {
    const cardDom = cardRef.current;
    if (cardDom) {
      cardDom.style.overflow = cardOverflow;
    }
  };

  // 往卡片添加光源
  const addLight = () => {
    if (typeof document === 'undefined') return;
    const cardDom = cardRef.current;
    const lightDom = createLightElement();
    if (cardDom && lightDom && !cardDom.contains(lightDom)) {
      cardDom.appendChild(lightDom);
      // 设置透明度，让光晕可见（如果颜色本身有透明度，这里用较高值）
      lightDom.style.opacity = '1';
    }
  };
  
  // 删除光源
  const removeLight = () => {
    const lightDom = lightRef.current;
    if (lightDom && lightDom.parentNode) {
      lightDom.style.opacity = '0';
      setTimeout(() => {
        if (lightDom.parentNode) {
          lightDom.parentNode.removeChild(lightDom);
        }
      }, 300);
    }
  };

  // 监听卡片的鼠标移入
  const onMouseEnter = () => {
    addLight();
    setCardOverflowHidden();
  };

  // 监听卡片的鼠标移动
  const onMouseMove = (e: MouseEvent) => {
    if (typeof document === 'undefined') return;
    const { clientX, clientY } = e;
    const cardDom = cardRef.current;
    const lightDom = createLightElement();
    
    if (cardDom && lightDom) {
      const { x, y } = cardDom.getBoundingClientRect();
      const { width = 80, height = 80 } = option.light ?? {};
      
      lightDom.style.left = `${clientX - x - width / 2}px`;
      lightDom.style.top = `${clientY - y - height / 2}px`;
    }
  };
  
  // 监听卡片鼠标移出
  const onMouseLeave = () => {
    removeLight();
    restoreCardOverflow();
  };

  useEffect(() => {
    setLightStyle();
    
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    }
    
    return () => {
      if (card) {
        card.removeEventListener('mouseenter', onMouseEnter);
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      }
      // 清理光源
      const lightDom = lightRef.current;
      if (lightDom && lightDom.parentNode) {
        lightDom.parentNode.removeChild(lightDom);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cardRef,
  };
};
