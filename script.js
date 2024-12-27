// 展示区域滚动功能
function scrollShowcase(rowIndex, scrollAmount) {
    const showcaseRows = document.querySelectorAll('.showcase-row');
    const currentRow = showcaseRows[rowIndex];
    currentRow.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// 初始化AOS动画库
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        disable: window.innerWidth < 768
    });

    // 标语切换效果
    const slogans = document.querySelectorAll('.slogan-container .subtitle');
    let currentSlogan = 0;

    function switchSlogan() {
        slogans.forEach(slogan => slogan.classList.remove('current'));
        currentSlogan = (currentSlogan + 1) % slogans.length;
        slogans[currentSlogan].classList.add('current');
    }

    setInterval(switchSlogan, 3000);
});

// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let isScrollingUp = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        if (!isScrollingUp) {
            navbar.style.transform = 'translateY(-100%)';
        }
        isScrollingUp = false;
    } else {
        navbar.style.transform = 'translateY(0)';
        isScrollingUp = true;
    }
    
    lastScrollTop = scrollTop;
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 优化图片加载
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.img-container img');
    
    images.forEach(img => {
        // 创建新的Image对象预加载图片
        const tempImage = new Image();
        tempImage.src = img.src;
        
        tempImage.onload = function() {
            img.style.opacity = '1';
        };
        
        // 如果图片加载失败，显示错误提示
        tempImage.onerror = function() {
            img.style.display = 'none';
            const errorText = document.createElement('div');
            errorText.className = 'image-error';
            errorText.textContent = '图片加载失败';
            img.parentNode.appendChild(errorText);
        };
    });
});

// 响应式导航菜单
const menuToggle = document.createElement('button');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<span></span><span></span><span></span>';
document.querySelector('.navbar .container').prepend(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 功能预览悬停效果
document.querySelectorAll('.feature-preview-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const tooltip = this.querySelector('.feature-tooltip');
        if (tooltip) {
            const rect = tooltip.getBoundingClientRect();
            if (rect.left < 0) {
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateY(0)';
            } else if (rect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
                tooltip.style.transform = 'translateY(0)';
            }
        }
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 效果展示区翻页功能
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.showcase-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.showcase-track');
        const items = track.querySelectorAll('.showcase-item');
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        
        // 复制项目用于无缝循环
        const clonedItems = Array.from(items).map(item => item.cloneNode(true));
        clonedItems.forEach(clone => track.appendChild(clone));
        
        const itemWidth = items[0].offsetWidth + 20; // 包含margin-right
        const totalWidth = itemWidth * items.length;
        const visibleWidth = slider.offsetWidth;
        const scrollStep = Math.floor(visibleWidth / itemWidth) * itemWidth;
        
        let isAnimating = false;
        let currentScroll = 0;
        
        // 初始化自动滚动
        function initAutoScroll() {
            track.style.transform = 'translateX(0)';
            track.style.transition = 'none';
            track.style.animation = 'autoScroll 120s linear infinite';
        }
        
        // 处理翻页
        function handleScroll(direction) {
            if (isAnimating) return;
            isAnimating = true;
            
            // 暂停自动滚动
            track.style.animation = 'none';
            
            // 获取当前位置
            const matrix = new WebKitCSSMatrix(getComputedStyle(track).transform);
            currentScroll = matrix.m41;
            
            // 计算目标位置
            let targetScroll = currentScroll + (direction === 'prev' ? scrollStep : -scrollStep);
            
            // 处理边界情况
            if (direction === 'prev' && targetScroll > 0) {
                // 如果向前滚动超过起点，立即跳转到末尾
                track.style.transition = 'none';
                track.style.transform = `translateX(${-totalWidth}px)`;
                track.offsetHeight; // 触发重排
                targetScroll = -totalWidth + scrollStep;
            } else if (direction === 'next' && targetScroll < -totalWidth) {
                // 如果向后滚动超过终点，立即跳转到起点
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                track.offsetHeight; // 触发重排
                targetScroll = -scrollStep;
            }
            
            // 应用过渡效果
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(${targetScroll}px)`;
            
            // 翻页完成后恢复自动滚动
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.animation = 'autoScroll 120s linear infinite';
                // 计算动画延迟，使其从当前位置继续
                track.style.animationDelay = `${targetScroll / totalWidth * 120}s`;
                isAnimating = false;
            }, 500);
        }
        
        // 绑定事件
        prev.addEventListener('click', () => handleScroll('prev'));
        next.addEventListener('click', () => handleScroll('next'));
        
        // 鼠标悬停控制
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // 动画结束时重置
        track.addEventListener('animationend', () => {
            initAutoScroll();
        });
        
        // 初始化
        initAutoScroll();
    });
}); 