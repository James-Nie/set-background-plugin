/**
 * 网络图片转化为base64格式
 */
function imageUrlToBase64(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
}


function setBackGroundImage(imageUrl) {
    if (imageUrl) {
        imageUrlToBase64(imageUrl)
            .then(base64 => {
                if (base64 && base64.includes('data:image')) {
                    chrome.storage.local.set({
                        backgroundUrl: base64
                    })
                }
            })
            .catch(error => {
                console.error('转换出错:', error);
            });
    }
}

/**
 * 添加右键菜单
 */
chrome.contextMenus.create({
    type: 'normal',
    title: '设置为背景',
    contexts: ['all'],
    id: 'menu-background'
});

/**
 * 添加右键菜单
 */
chrome.contextMenus.create({
    type: 'normal',
    title: '跳舞',
    contexts: ['all'],
    id: 'menu-dance'
});

/**
 * 右键菜单点击事件
 */
chrome.contextMenus.onClicked.addListener(function(data) {
    if (data.menuItemId == 'menu-background') {
        if (data.mediaType && data.mediaType === 'image') {
            setBackGroundImage(data.srcUrl)
        }
    } else if(data.menuItemId == 'menu-dance') {
        chrome.tabs.query({
            active: true
        }).then((tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, 'danceAnimation');
        })
    }
})

// 通知
chrome.storage.onChanged.addListener(async function(changes, areaName) {
    if (changes.backgroundUrl ||
        changes.backgroundType ||
        changes.backgroundColor ||
        changes.backgroundOpacity ||
        changes.backgroundSaturate ||
        changes.backgroundContrast ||
        changes.backgroundCheck ||
        changes.backgroundSize
    ) {
        const tabs = await chrome.tabs.query({
            active: true
        });

        for (let index = 0; index < tabs.length; index++) {
            const tab = tabs[index];
            chrome.tabs.sendMessage(tab.id, 'changeBackground', (response) => {
                console.log('response===', response);
            });
        }
    }
});

// 初始化图片参数
function initOptions() {
    chrome.storage.local.set({
        backgroundOpacity: 0.15,
        backgroundSaturate: 1,
        backgroundContrast: 1,
        backgroundImages: [],
        backgroundSize: 1,
        backgroundCheck: true,
        backgroundColor: '#FAF9DE'
    });
}

initOptions();