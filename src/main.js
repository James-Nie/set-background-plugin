// 页面初始化
window.addEventListener('load', async function(e) {
    setBackGroundImage();
    addDanceStyle();

    // createBubble();
})

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        setBackGroundImage();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 发送响应消息
    sendResponse('from main.js');

    if (message === 'changeBackground') {
        setBackGroundImage()
    } else if (message === 'danceAnimation') {
        danceAnimation();
    }
});

function setBackGroundImage() {
    chrome.storage.local.get(['backgroundType', 'backgroundUrl', 'backgroundOpacity', 'backgroundSaturate', 'backgroundContrast', 'backgroundColor', 'backgroundSize']).then(result => {
        try {
            const backgroundType = result.backgroundType;
            const backgroundColor = result.backgroundColor;
            const backgroundOpacity = parseFloat(result.backgroundOpacity) * 100 + '%';
            const backgroundSaturate = parseFloat(result.backgroundSaturate) * 100 + '%';
            const backgroundContrast = parseFloat(result.backgroundContrast) * 100 + '%';
            const backgroundSize = parseFloat(result.backgroundSize) * 100 + '%';

            var bgDom = document.querySelector('#set-background-box');
            if (bgDom) {
                bgDom.remove();
            }
            bgDom = document.createElement('div');
            bgDom.id = 'set-background-box';
            bgDom.style.width = '100%';
            bgDom.style.height = '100%';
            if (backgroundType === 'image') {
                bgDom.style.backgroundImage = `url(${result.backgroundUrl})`;
                // bgDom.style.backgroundSize = backgroundSize;
                bgDom.style.backgroundSize = 'cover';
                bgDom.style.backgroundRepeat = 'no-repeat';
                bgDom.style.backgroundPosition = 'center';
                bgDom.style.filter = `opacity(${backgroundOpacity}) saturate(${backgroundSaturate}) contrast(${backgroundContrast})`;
            } else {
                bgDom.style.backgroundColor = backgroundColor;
                bgDom.style.opacity = '0.2';
            }

            bgDom.style.zIndex = '99';
            bgDom.style.position = 'fixed';
            bgDom.style.top = '0';
            bgDom.style.left = '0';
            bgDom.style.pointerEvents = 'none';
            document.body.after(bgDom);

        } catch (error) {
            console.log(error)
        }

    });
}


function addDanceStyle() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .__dance {
            animation: __dance 0.5s ease;
        }
        @keyframes __dance {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0);
            }
        }

        .kuang {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 199;
            pointer-events: none;
        }
        .bubble {
            position: absolute;
            border-radius: 50%;
            border: 2px solid #c63cc4bf;
            box-shadow: inset 0 0 8px #c63cc4bf;
            animation: flutter 10s infinite;
            opacity: 0;
        }
        @keyframes flutter {
            0%{
                transform: translateX(0);
                bottom: -100px;
                opacity: 1;
            }
            50%{
                transform: translateX(100px);
                opacity: 0.5;
            }

            
            100%{
                transform: translateX(0px);
                bottom: 100%;
                opacity: 0;

            }
        }
        .bubble:nth-child(1){
            left: -10%;
            width: 50px;
            height: 50px; 
            animation-duration: 9s;
            animation-delay: 0.1s;
        }
        .bubble:nth-child(2){
            left: 15%;
            width: 20px;
            height: 20px;
            animation-duration: 6s;
            animation-delay: 1.5s;

        }
        .bubble:nth-child(3){
            left: 20%;
            width: 60px;
            height: 60px;
            animation-duration: 10s;
        }
        .bubble:nth-child(4){
            left: 30%;
            width: 30px;
            height: 30px;
            animation-duration: 5.5s;
            animation-delay: 1.5s;
        }
        .bubble:nth-child(5){
            left: 40%x;
            width: 50px;
            height: 50px;
            animation-duration: 12s;
        }
        .bubble:nth-child(6){
            left: 50%;
            width: 20px;
            height: 20px;
            animation-duration: 6s;
            animation-delay: 1s;

        }
        .bubble:nth-child(7){
            left: 60%;
            width: 40px;
            height: 40px;
            animation-duration: 8s;
            animation-delay: 1s;
        }
        .bubble:nth-child(8){
            left: 65%;
            width: 60px;
            height: 60px;
            animation-duration: 15s;
        }
        .bubble:nth-child(9){
            left: 80%;
            width: 55px;
            height: 55px;
            animation-duration: 9s;
            animation-delay: 0.5s;
            
        }
        .bubble:nth-child(10){
            left: 100%;
            width: 40px;
            height: 40px;
            animation-duration: 12s;

        }
    `;
    document.head.appendChild(style);
}

// 页面所有的元素依次跳动的动画
function danceAnimation() {
    var elements = document.body.querySelectorAll('*');
    let delay = 0;

    var contentEles = [];
    elements.forEach(element => {
        if(element.childNodes[0] && ['#text', 'svg'].includes(element.childNodes[0].nodeName)) {
            contentEles.push(element)
        } ;
    })

    contentEles.forEach(element => {
        // 文本节点
        setTimeout(() => {
            element.classList.add('__dance');
            element.addEventListener('animationend', () => {
                // element.classList.remove('__dance');
            }, {
                once: true
            });
        }, delay);
        delay += 300; // Adjust the delay as needed
    })

}

function createBubble() {
    const kuang = document.createElement('div');
    kuang.classList.add('kuang');

    const bubble = `
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
    `;
    kuang.innerHTML = bubble;
    document.body.after(kuang);
}