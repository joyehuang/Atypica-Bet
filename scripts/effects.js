/**
 * 页面背景动态跟随鼠标效果
 */
document.addEventListener('DOMContentLoaded', () => {
  // 创建背景动态元素
  const bgEffect = document.createElement('div');
  bgEffect.classList.add('mouse-follow-bg');
  document.body.appendChild(bgEffect);

  // 监听鼠标移动
  document.addEventListener('mousemove', (e) => {
    // 获取鼠标位置
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 应用动态效果
    requestAnimationFrame(() => {
      bgEffect.style.left = `${mouseX}px`;
      bgEffect.style.top = `${mouseY}px`;
      bgEffect.style.opacity = '1';
    });
  });

  // 卡片光效跟踪
  const trackMouseOnCards = () => {
    const cards = document.querySelectorAll('.spotlight-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  };

  // 执行初始化
  trackMouseOnCards();

  // 对于动态加载的卡片，定期检查并添加事件监听
  setInterval(trackMouseOnCards, 2000);
});