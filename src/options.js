const BACKGROUND_TYPE_KEY = 'backgroundType';
const URL_KEY = 'backgroundUrl';
const COLOR_KEY = 'backgroundColor';
const OPACITY_KEY = 'backgroundOpacity';
const SATURATE_KEY = 'backgroundSaturate';
const CONTRAST_KEY = 'backgroundContrast';
const SIZE_KEY = 'backgroundSize';
const IMAGES_KEY = 'backgroundImages';

function _$(selector) {
    return document.querySelector(selector);
}

function queryRadioValue(radio) {
    const radios = document.querySelectorAll(`input[name="${radio}"]`);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

//保存用户配置
function saveOptions(value) {
    chrome.storage.local.set(value)
}

function getHistoryImages() {
    return new Promise((resolve) => {
        chrome.storage.local.get([IMAGES_KEY]).then((result) => {
            const images = result[IMAGES_KEY] || [];
            resolve(images);
        });
    })
}

window.onload = function() {
    _$('#background-image-preview').addEventListener('click', function(e) {
        _$('#background-image').click();
    })

    //监听输入框, 将图片转化为base64
    _$('#background-image').addEventListener('change', function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            var base64 = e.target.result;
            var value = {
                [URL_KEY]: base64
            }
            _$('#background-image-preview').style.backgroundImage = `url(${base64})`;
            saveOptions(value);
        };
    })

    // 调整透明度
    _$('#background-opacity').addEventListener('input', function(e) {
        let opacity = _$('#background-opacity').value;

        var value = {
            [OPACITY_KEY]: opacity
        }
        _$('#opacity-range').innerText = opacity * 100 + '%';
        saveOptions(value);

        renderImageView();
    })

    // 调整饱和度
    _$('#background-saturate').addEventListener('input', function(e) {
        let saturate = _$('#background-saturate').value;

        var value = {
            [SATURATE_KEY]: saturate
        }
        _$('#saturate-range').innerText = saturate * 100 + '%';
        saveOptions(value);

        renderImageView();
    })

    // 调整对比度
    _$('#background-contrast').addEventListener('input', function(e) {
        let contrast = _$('#background-contrast').value;

        var value = {
            [CONTRAST_KEY]: contrast
        }
        _$('#contrast-range').innerText = contrast * 100 + '%';
        saveOptions(value);

        renderImageView();
    })

    // 调整缩放比
    // _$('#background-size').addEventListener('input', function(e) {
    //     let size = _$('#background-size').value;

    //     var value = {
    //         [SIZE_KEY]: size
    //     }
    //     _$('#size-range').innerText = size * 100 + '%';
    //     saveOptions(value);

    //     renderImageView();
    // })

    // 删除、设置操作
    _$('#image-list').addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        getHistoryImages().then((images) => {
            const image = images[index];
            if (e.target.classList.contains('delete-button')) {
                images.splice(index, 1);
                chrome.storage.local.set({
                    [IMAGES_KEY]: images
                })
            } else if (e.target.classList.contains('set-button')) {
                chrome.storage.local.set({
                    [URL_KEY]: image
                })
                renderImageView();
            }
            renderImagesList();
        })


    })

    //加在默认数据
    renderType();
    renderImageView();
    renderImagesList();
    renderColors();

    // 护眼模式选择
    document.querySelectorAll('input[name="type"]').forEach((radio) => {
        radio.addEventListener('change', function(e) {
            renderType();
        })
    })

    // 颜色切换
    document.querySelectorAll('input[name="color"]').forEach((radio) => {
        radio.addEventListener('change', function(e) {
            const color = queryRadioValue('color');
            saveOptions({
                [COLOR_KEY]: color
            })
        })
    })
}

// 预览图片
function renderImageView() {
    chrome.storage.local.get([URL_KEY, OPACITY_KEY, SATURATE_KEY, CONTRAST_KEY, BACKGROUND_TYPE_KEY, SIZE_KEY]).then((result) => {
        const type = result[BACKGROUND_TYPE_KEY];
        const imageUrl = result[URL_KEY] || 1;
        const opacity = result[OPACITY_KEY] || 1;
        const saturate = result[SATURATE_KEY] || 1;
        const contrast = result[CONTRAST_KEY] || 1;
        const size = result[SIZE_KEY] || 1;
        
        document.querySelectorAll('input[name="type"]').forEach((radio) => {
            if (radio.value === type) {
                radio.checked = true;
            }
        })

        _$('#background-opacity').value = opacity;
        _$('#opacity-range').innerText = opacity * 100 + '%';

        _$('#background-saturate').value = saturate;
        _$('#saturate-range').innerText = saturate * 100 + '%';

        _$('#background-contrast').value = contrast;
        _$('#contrast-range').innerText = contrast * 100 + '%';

        // _$('#background-size').value = size;
        // _$('#size-range').innerText = size * 100 + '%';

        _$('#background-image-preview').style.backgroundImage = `url(${imageUrl})`;
        // _$('#background-image-preview').style.backgroundSize = size * 100 + '%';
        _$('#background-image-preview').style.filter = `opacity(${opacity * 100}%) saturate(${saturate * 100}%) contrast(${contrast * 100}%)`;
    });
}

// 历史图片渲染
function renderImagesList() {
    const imageList = _$('#image-list');
    const imageItesm = [];
    getHistoryImages().then((images) => {
        images.forEach((image, index) => {
            imageItesm.push(
                `<div class="image-item">
                    <img src=${image} alt="">
                    <button class="delete-button" data-index=${index}>删除</button>
                    <button class="set-button" data-index=${index}>设置当前图片</button>
                </div>`
            )
        });
        imageList.innerHTML = imageItesm.join('');
    });
}

function renderType() {
    setTimeout(() => {
        const type = queryRadioValue('type');
        
        if (type === 'color') {
            _$('#choose-color').style.display = 'flex';
            _$('#choose-image').style.display = 'none';
        } else {
            _$('#choose-color').style.display = 'none';
            _$('#choose-image').style.display = 'block';
        }
        saveOptions({
            [BACKGROUND_TYPE_KEY]: type
        })
    }, 10);

}

function renderColors() {
    const colors = [{
        name: '绿豆沙',
        color: '#C7EDCC'
    }, {
        name: '银河白',
        color: '#FFFFFF'
    }, {
        name: '杏仁黄',
        color: '#FAF9DE'
    }, {
        name: '秋叶褐',
        color: '#FFF2E2'
    }, {
        name: '胭脂红',
        color: '#FDE6E0'
    }, {
        name: '青草绿',
        color: '#E3EDCD'
    }, {
        name: '海天蓝',
        color: '#DCE2F1'
    }, {
        name: '葛巾紫',
        color: '#E9EBFE'
    }, {
        name: '极光灰',
        color: '#EAEAEF'
    }, {
        name: '青草绿',
        color: '#E3EDCD'
    }, {
        name: '电脑管家',
        color: '#CCE8CF'
    }];
    const colorList = _$('#choose-color');

    const colorItesm = colors.map((item, index) => {
        return `<div class="color-item" style="background-color: ${color.color}">
                    <input type="radio" id="${item.color}" value="${item.color}" name="color">
                    <label for="${item.color}">${item.name}</label>
                </div>`

    });

    colorList.innerHTML = colorItesm.join('');

    chrome.storage.local.get([COLOR_KEY]).then((result) => {
        const color = result[COLOR_KEY];
        document.querySelectorAll('input[name="color"]').forEach((radio) => {
            if (radio.value === color) {
                radio.checked = true;
            }
        })
    })
    
        
}

// 监听message
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === 'changeBackground') {
        renderImageView();

        getHistoryImages().then((images) => {
            chrome.storage.local.get([URL_KEY]).then((result) => {
                const currentImage = result[URL_KEY];
                if (!images.includes(currentImage)) {
                    images.unshift(currentImage);
                    chrome.storage.local.set({
                        [IMAGES_KEY]: images
                    })
                    renderImagesList();
                }
            })

        })
    }
});