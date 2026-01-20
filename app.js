/**
 * 字帖生成器 - 核心逻辑
 */

// 字符显示模式
const DisplayMode = {
    NORMAL: 'normal',           // 显示拼音 + 汉字
    CHAR_ONLY: 'char-only',     // 只显示汉字，不显示拼音
    PINYIN_ONLY: 'pinyin-only', // 只显示拼音，汉字空白
    HIDDEN: 'hidden'            // 都不显示，空白格子
};

// 模式显示名称
const ModeLabels = {
    [DisplayMode.NORMAL]: '正常',
    [DisplayMode.CHAR_ONLY]: '仅汉字',
    [DisplayMode.PINYIN_ONLY]: '仅拼音',
    [DisplayMode.HIDDEN]: '隐藏'
};

// 预置内容数据
const PRESETS = {
    grade1: {
        name: '一年级常用字',
        items: [
            { name: '第一组（人口手）', content: '人 口 手 大 小 上 下 左 右 中 天 地 日 月 水 火 山 石 田 土' },
            { name: '第二组（一二三）', content: '一 二 三 四 五 六 七 八 九 十 百 千 万 个 只 双 对 半 全' },
            { name: '第三组（我你他）', content: '我 你 他 她 它 们 的 是 在 有 这 那 什 么 谁 哪 里 怎 样' },
            { name: '第四组（爸妈家）', content: '爸 爸 妈 妈 爷 爷 奶 奶 哥 哥 姐 姐 弟 弟 妹 妹 家 人 好' },
            { name: '数字练习', content: '零 一 二 三 四 五 六 七 八 九 十 百 千 万 亿' }
        ]
    },
    grade2: {
        name: '二年级常用字',
        items: [
            { name: '第一组（春夏秋冬）', content: '春 夏 秋 冬 风 雨 雪 霜 云 雾 露 冰 晴 阴 热 冷 暖 凉' },
            { name: '第二组（动物）', content: '虎 豹 狮 象 猴 鹿 熊 兔 狼 狐 鸡 鸭 鹅 猪 牛 羊 马 狗 猫' },
            { name: '第三组（植物）', content: '花 草 树 木 叶 根 茎 枝 果 瓜 菜 豆 米 麦 禾 苗 芽 种 植' },
            { name: '第四组（颜色）', content: '红 橙 黄 绿 青 蓝 紫 黑 白 灰 粉 金 银 彩 色 深 浅 亮 暗' }
        ]
    },
    grade3: {
        name: '三年级常用字',
        items: [
            { name: '第一组（学习）', content: '学 习 读 写 算 思 考 问 答 说 听 看 练 背 记 忆 理 解 知 识' },
            { name: '第二组（品德）', content: '诚 信 善 良 勤 俭 勇 敢 谦 虚 礼 貌 尊 敬 友 爱 团 结 互 助' },
            { name: '第三组（身体）', content: '头 发 眼 耳 鼻 口 牙 舌 面 颈 肩 臂 手 指 腰 腿 脚 趾 心 肝' }
        ]
    },
    poems: {
        name: '经典古诗',
        items: [
            { name: '静夜思 - 李白', content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。' },
            { name: '春晓 - 孟浩然', content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。' },
            { name: '悯农 - 李绅', content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。' },
            { name: '咏鹅 - 骆宾王', content: '鹅鹅鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。' },
            { name: '登鹳雀楼 - 王之涣', content: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。' },
            { name: '望庐山瀑布 - 李白', content: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。' },
            { name: '江雪 - 柳宗元', content: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。' },
            { name: '游子吟 - 孟郊', content: '慈母手中线，\n游子身上衣。\n临行密密缝，\n意恐迟迟归。\n谁言寸草心，\n报得三春晖。' }
        ]
    },
    poems2: {
        name: '必背古诗（按年级）',
        items: [
            { name: '一年级 - 画', content: '远看山有色，\n近听水无声。\n春去花还在，\n人来鸟不惊。' },
            { name: '一年级 - 画鸡', content: '头上红冠不用裁，\n满身雪白走将来。\n平生不敢轻言语，\n一叫千门万户开。' },
            { name: '一年级 - 风', content: '解落三秋叶，\n能开二月花。\n过江千尺浪，\n入竹万竿斜。' },
            { name: '二年级 - 赠汪伦', content: '李白乘舟将欲行，\n忽闻岸上踏歌声。\n桃花潭水深千尺，\n不及汪伦送我情。' },
            { name: '二年级 - 绝句', content: '两个黄鹂鸣翠柳，\n一行白鹭上青天。\n窗含西岭千秋雪，\n门泊东吴万里船。' },
            { name: '二年级 - 小池', content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。' },
            { name: '三年级 - 望天门山', content: '天门中断楚江开，\n碧水东流至此回。\n两岸青山相对出，\n孤帆一片日边来。' },
            { name: '三年级 - 九月九日忆山东兄弟', content: '独在异乡为异客，\n每逢佳节倍思亲。\n遥知兄弟登高处，\n遍插茱萸少一人。' }
        ]
    },
    vocabulary: {
        name: '词语练习',
        items: [
            { name: 'AABB词语', content: '高高兴兴 开开心心 快快乐乐 平平安安 干干净净 整整齐齐 明明白白 清清楚楚 认认真真 仔仔细细' },
            { name: 'ABB词语', content: '红彤彤 绿油油 亮晶晶 白花花 黑乎乎 金灿灿 胖乎乎 圆滚滚 甜蜜蜜 静悄悄' },
            { name: 'ABAB词语', content: '研究研究 考虑考虑 商量商量 讨论讨论 打扫打扫 整理整理 活动活动 休息休息' },
            { name: '反义词', content: '大小 多少 前后 左右 上下 高低 长短 快慢 远近 黑白 新旧 好坏 冷热 开关' },
            { name: '量词搭配', content: '一只鸟 一条鱼 一朵花 一棵树 一片叶 一座山 一条河 一本书 一支笔 一张纸' }
        ]
    },
    radicals: {
        name: '偏旁部首',
        items: [
            { name: '三点水（氵）', content: '江 河 湖 海 洋 泪 汗 池 汁 汤 洗 游 清 深 浅' },
            { name: '木字旁（木）', content: '树 林 森 村 杨 柳 桃 杏 松 柏 桥 梅 棉 柴 板' },
            { name: '口字旁（口）', content: '唱 听 吃 喝 叫 号 吹 嘴 呢 吗 呀 哪 哈 啊 吧' },
            { name: '女字旁（女）', content: '妈 姐 妹 奶 姑 娘 如 好 她 姓 姨 婆 嫁 妻 始' },
            { name: '言字旁（讠）', content: '说 话 语 读 认 让 记 议 论 许 诗 讲 请 谢 谈' },
            { name: '提手旁（扌）', content: '打 拉 拍 把 抱 找 拿 挂 挑 拨 持 护 拾 推 招' },
            { name: '人字旁（亻）', content: '他 们 你 住 作 做 休 体 位 伴 但 件 何 低 传' },
            { name: '草字头（艹）', content: '花 草 苗 芽 茶 菜 药 荷 落 著 莲 萝 蓝 苹 葡' }
        ]
    },
    daily: {
        name: '日常词汇',
        items: [
            { name: '家庭成员', content: '爸爸 妈妈 爷爷 奶奶 外公 外婆 哥哥 姐姐 弟弟 妹妹 叔叔 阿姨' },
            { name: '身体部位', content: '头 眼 耳 鼻 口 手 脚 牙 舌 心 脸 眉 腿 肩 背' },
            { name: '颜色', content: '红 黄 蓝 绿 紫 橙 粉 黑 白 灰 青 棕 金 银 彩' },
            { name: '动物', content: '猫 狗 鸡 鸭 鹅 猪 牛 羊 马 鱼 鸟 虫 蛇 兔 猴 虎 熊 象' },
            { name: '水果', content: '苹果 香蕉 西瓜 草莓 葡萄 橘子 梨 桃 樱桃 芒果 柠檬 菠萝' },
            { name: '蔬菜', content: '白菜 萝卜 土豆 番茄 黄瓜 茄子 青椒 南瓜 冬瓜 豆角 玉米' },
            { name: '学习用品', content: '书 本 笔 纸 尺 橡皮 铅笔 毛笔 书包 文具盒 课桌 黑板' },
            { name: '交通工具', content: '车 船 飞机 火车 地铁 公交 自行车 摩托车 轮船 汽车' }
        ]
    },
    pinyin: {
        name: '拼音专项',
        items: [
            { name: '前鼻音（an en in）', content: '安 恩 因 温 云 门 人 真 天 年 边 见 面 言 眠' },
            { name: '后鼻音（ang eng ing）', content: '昂 灯 丁 东 龙 风 红 冷 请 青 星 行 明 声 生' },
            { name: '平舌音（z c s）', content: '子 次 四 思 字 此 丝 资 词 似 座 错 所 素 组' },
            { name: '翘舌音（zh ch sh r）', content: '知 吃 十 日 只 尺 是 入 之 池 时 如 纸 齿 诗' },
            { name: '整体认读（yi wu yu）', content: '一 五 雨 衣 午 鱼 医 无 于 以 物 语 已 舞 育' }
        ]
    },
    idioms: {
        name: '常用成语',
        items: [
            { name: '学习类成语', content: '勤学苦练 学以致用 温故知新 举一反三 不耻下问 孜孜不倦 学无止境 博学多才' },
            { name: '品德类成语', content: '诚实守信 助人为乐 尊老爱幼 拾金不昧 见义勇为 舍己为人 知错就改 自强不息' },
            { name: '动物类成语', content: '画龙点睛 对牛弹琴 马到成功 虎头蛇尾 守株待兔 亡羊补牢 狐假虎威 井底之蛙' },
            { name: '数字类成语', content: '一心一意 三心二意 四面八方 五颜六色 七上八下 九牛一毛 十全十美 百发百中' }
        ]
    },
    strokes: {
        name: '笔顺练习',
        items: [
            { name: '横（一）', content: '一 二 三 十 王 工 土 干 开 天' },
            { name: '竖（丨）', content: '十 中 川 个 上 下 卡 木 本 来' },
            { name: '撇（丿）', content: '人 八 入 大 天 夫 头 生 午 千' },
            { name: '捺（㇏）', content: '人 大 太 天 夫 央 头 走 足 之' },
            { name: '点（丶）', content: '六 文 主 玉 立 方 火 为 头 义' },
            { name: '横折（㇕）', content: '口 日 目 田 四 白 百 回 国 因' },
            { name: '竖折（㇗）', content: '山 出 画 凸 凹 幽 巡 区 医 匠' },
            { name: '撇折（㇜）', content: '么 公 去 云 会 能 台 参 私 育' },
            { name: '横钩（㇖）', content: '买 卖 写 字 学 宝 家 完 定 安' },
            { name: '竖钩（亅）', content: '小 水 木 东 来 乐 求 采 录 永' },
            { name: '斜钩（㇂）', content: '我 成 找 战 或 式 试 识 代 伐' },
            { name: '弯钩（㇁）', content: '了 子 孔 孙 手 承 乎 乒 乓 狐' }
        ]
    }
};

// 应用状态
const state = {
    words: [],          // 解析后的词组数组
    chars: [],          // 所有字符及其状态 { char, pinyin, mode, wordIndex }
    borderColor: '#cccccc',
    title: '汉字练习',
    ending: '加油！每天进步一点点',
    currentFont: 'LXGW WenKai GB',  // 当前字体
    charSize: 100,      // 字符大小百分比
    gridType: 'mi',     // 格子类型: mi(米字格), tian(田字格), kou(口字格)
    charOpacity: 100,   // 字符灰度/透明度百分比
    showPinyin: true,   // 是否显示拼音格
    gridSizeMm: 18,     // 格子大小毫米
    showName: true,     // 显示姓名栏
    showClass: false,   // 显示班级栏
    showDate: true,     // 显示日期栏
    showRating: false,  // 显示评分区
    traceMode: false,   // 描红模式
    traceCount: 4,      // 每字重复次数
    strokeMode: false,  // 笔顺模式
    strokeData: {},     // 汉字笔画数据缓存
    // 打卡模式
    checkInMode: false,     // 是否启用打卡模式
    checkInRegions: 6,      // 区域数量 4/6/8
    checkInStartLesson: 1,  // 起始课次
    checkInContents: ['', '', '', '', '', '', '', ''] // 每个区域的内容
};

// 布局设置（可动态调整）
const LAYOUT = {
    CHARS_PER_ROW: 10,  // 每行字数
    MAX_ROWS: 9         // 每页行数（根据格子大小动态计算）
};

// A4纸张尺寸（毫米）
const A4 = {
    WIDTH: 210,
    HEIGHT: 297,
    MARGIN_TOP: 25,     // 顶部边距（标题区域）
    MARGIN_BOTTOM: 25,  // 底部边距（页码+评分区域）
    CONTENT_HEIGHT: 235 // 可用内容高度 = 297 - 25 - 25 - 12(信息栏+余量)
};

// DOM 元素引用
const elements = {};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    loadSettings(); // 加载保存的设置
    bindEvents();
    initGridTypeButtons();
    initOpacityControls();
    initLayoutControls();
    initSaveControls();
    initPresetControls();
    updatePreview();
});

// 预置内容控件初始化
function initPresetControls() {
    const categorySelect = document.getElementById('presetCategory');
    const contentSelect = document.getElementById('presetContent');
    const replaceBtn = document.getElementById('replacePreset');
    const appendBtn = document.getElementById('appendPreset');

    // 分类选择变化时，更新内容列表
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        contentSelect.innerHTML = '';

        if (category && PRESETS[category]) {
            const preset = PRESETS[category];
            contentSelect.disabled = false;
            replaceBtn.disabled = false;
            appendBtn.disabled = false;

            preset.items.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = item.name;
                contentSelect.appendChild(option);
            });
        } else {
            contentSelect.innerHTML = '<option value="">请先选择分类...</option>';
            contentSelect.disabled = true;
            replaceBtn.disabled = true;
            appendBtn.disabled = true;
        }
    });

    // 替换按钮点击（清除后插入）
    replaceBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        const contentIndex = contentSelect.value;

        if (category && PRESETS[category] && contentIndex !== '') {
            const content = PRESETS[category].items[contentIndex].content;
            elements.textInput.value = content;
            parseText(content);
            updatePreview();
        }
    });

    // 追加按钮点击（在现有内容后添加）
    appendBtn.addEventListener('click', () => {
        const category = categorySelect.value;
        const contentIndex = contentSelect.value;

        if (category && PRESETS[category] && contentIndex !== '') {
            const content = PRESETS[category].items[contentIndex].content;
            const existing = elements.textInput.value;
            // 如果现有内容不为空，添加换行分隔
            const newContent = existing ? existing + '\n' + content : content;
            elements.textInput.value = newContent;
            parseText(newContent);
            updatePreview();
        }
    });
}

// 保存设置到 localStorage
function saveSettings() {
    // 保存每个字符的显示模式
    const charModes = state.chars.map(c => c.mode);

    const settings = {
        text: elements.textInput.value,
        borderColor: state.borderColor,
        title: elements.titleInput.value,
        ending: elements.endingInput.value,
        font: state.currentFont,
        charSize: state.charSize,
        gridType: state.gridType,
        charOpacity: state.charOpacity,
        showPinyin: state.showPinyin,
        gridSizeMm: state.gridSizeMm,
        charsPerRow: LAYOUT.CHARS_PER_ROW,
        charModes: charModes  // 保存每个字符的显示模式
    };

    localStorage.setItem('copybook_settings', JSON.stringify(settings));

    const hint = document.getElementById('saveHint');
    hint.textContent = '✓ 设置已保存';
    setTimeout(() => { hint.textContent = ''; }, 2000);
}

// 从 localStorage 加载设置
function loadSettings() {
    const saved = localStorage.getItem('copybook_settings');
    if (!saved) return;

    try {
        const settings = JSON.parse(saved);

        // 恢复文本输入
        if (settings.text) elements.textInput.value = settings.text;
        if (settings.title) elements.titleInput.value = settings.title;
        if (settings.ending) elements.endingInput.value = settings.ending;

        // 恢复状态
        if (settings.borderColor) state.borderColor = settings.borderColor;
        if (settings.font) state.currentFont = settings.font;
        if (settings.charSize) state.charSize = settings.charSize;
        if (settings.gridType) state.gridType = settings.gridType;
        if (settings.charOpacity) state.charOpacity = settings.charOpacity;
        if (settings.showPinyin !== undefined) state.showPinyin = settings.showPinyin;
        if (settings.gridSizeMm) state.gridSizeMm = settings.gridSizeMm;
        if (settings.charsPerRow) LAYOUT.CHARS_PER_ROW = settings.charsPerRow;

        // 更新UI控件
        if (settings.borderColor) {
            elements.borderColor.value = settings.borderColor;
            elements.colorValue.textContent = settings.borderColor;
        }
        if (settings.font) elements.fontSelect.value = settings.font;
        if (settings.charSize) {
            document.getElementById('charSizeSlider').value = settings.charSize;
            document.getElementById('charSizeValue').textContent = settings.charSize + '%';
        }
        if (settings.charOpacity) {
            document.getElementById('charOpacitySlider').value = settings.charOpacity;
            document.getElementById('charOpacityValue').textContent = settings.charOpacity + '%';
        }
        if (settings.showPinyin !== undefined) {
            document.getElementById('showPinyin').checked = settings.showPinyin;
        }

        // 解析文本
        parseText(elements.textInput.value);
        state.title = settings.title || state.title;
        state.ending = settings.ending || state.ending;

        // 恢复每个字符的显示模式
        if (settings.charModes && settings.charModes.length === state.chars.length) {
            state.chars.forEach((charData, index) => {
                charData.mode = settings.charModes[index];
            });
        }

        const hint = document.getElementById('saveHint');
        hint.textContent = '已加载上次保存的设置';
        setTimeout(() => { hint.textContent = ''; }, 2000);
    } catch (e) {
        console.error('加载设置失败:', e);
    }
}

// 清除保存的设置
function clearSettings() {
    localStorage.removeItem('copybook_settings');
    const hint = document.getElementById('saveHint');
    hint.textContent = '已清除保存的设置';
    hint.style.color = '#e53e3e';
    setTimeout(() => {
        hint.textContent = '';
        hint.style.color = '';
    }, 2000);
}

// 初始化保存控件
function initSaveControls() {
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    document.getElementById('clearSettings').addEventListener('click', clearSettings);
}

// 初始化 DOM 元素引用
function initElements() {
    elements.textInput = document.getElementById('textInput');
    // charList 已移除，使用预览区点击切换模式
    elements.borderColor = document.getElementById('borderColor');
    elements.colorValue = document.getElementById('colorValue');
    elements.titleInput = document.getElementById('titleInput');
    elements.endingInput = document.getElementById('endingInput');
    elements.exportPdf = document.getElementById('exportPdf');
    elements.pagesContainer = document.getElementById('pagesContainer');
    // 字体相关
    elements.fontSelect = document.getElementById('fontSelect');
    elements.fontUpload = document.getElementById('fontUpload');
    elements.detectLocalFonts = document.getElementById('detectLocalFonts');
    elements.fontStatus = document.getElementById('fontStatus');
}

// 绑定事件
function bindEvents() {
    // 文字输入
    elements.textInput.addEventListener('input', handleTextInput);

    // 边框颜色
    elements.borderColor.addEventListener('input', handleColorChange);

    // 颜色预设
    document.querySelectorAll('.color-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            elements.borderColor.value = color;
            handleColorChange({ target: { value: color } });
        });
    });

    // 标题
    elements.titleInput.addEventListener('input', (e) => {
        state.title = e.target.value;
        updatePreview();
    });

    // 结束语
    elements.endingInput.addEventListener('input', (e) => {
        state.ending = e.target.value;
        updatePreview();
    });

    // 导出 PDF
    elements.exportPdf.addEventListener('click', exportToPdf);

    // 导出图片
    document.getElementById('exportPng').addEventListener('click', exportToPng);

    // 字体选择
    elements.fontSelect.addEventListener('change', handleFontChange);

    // 字体上传
    elements.fontUpload.addEventListener('change', handleFontUpload);

    // 检测本机字体
    elements.detectLocalFonts.addEventListener('click', detectLocalFonts);

    // 字体下载弹窗
    document.getElementById('openFontDownloadModal').addEventListener('click', () => {
        document.getElementById('fontDownloadModal').style.display = 'flex';
    });
    document.getElementById('closeFontModal').addEventListener('click', () => {
        document.getElementById('fontDownloadModal').style.display = 'none';
    });
    document.getElementById('fontDownloadModal').addEventListener('click', (e) => {
        if (e.target.id === 'fontDownloadModal') {
            document.getElementById('fontDownloadModal').style.display = 'none';
        }
    });

    // 批量模式按钮
    document.getElementById('setAllNormal').addEventListener('click', () => setAllMode(DisplayMode.NORMAL));
    document.getElementById('setAllCharOnly').addEventListener('click', () => setAllMode(DisplayMode.CHAR_ONLY));
    document.getElementById('setAllPinyinOnly').addEventListener('click', () => setAllMode(DisplayMode.PINYIN_ONLY));

    // 字符大小滑块
    document.getElementById('charSizeSlider').addEventListener('input', handleCharSizeChange);
    document.getElementById('applySizeBtn').addEventListener('click', applySizeChange);

    // 学生信息栏和评分区
    document.getElementById('showName').addEventListener('change', (e) => {
        state.showName = e.target.checked;
        updatePreview();
    });
    document.getElementById('showClass').addEventListener('change', (e) => {
        state.showClass = e.target.checked;
        updatePreview();
    });
    document.getElementById('showDate').addEventListener('change', (e) => {
        state.showDate = e.target.checked;
        updatePreview();
    });
    document.getElementById('showRating').addEventListener('change', (e) => {
        state.showRating = e.target.checked;
        updatePreview();
    });

    // 描红模式
    document.getElementById('traceMode').addEventListener('change', (e) => {
        state.traceMode = e.target.checked;
        document.getElementById('traceOptions').style.display = e.target.checked ? 'flex' : 'none';
        // 描红模式和笔顺模式互斥
        if (e.target.checked && state.strokeMode) {
            state.strokeMode = false;
            document.getElementById('strokeMode').checked = false;
            document.getElementById('strokeHint').style.display = 'none';
        }
        updatePreview();
    });
    document.getElementById('traceCount').addEventListener('change', (e) => {
        state.traceCount = parseInt(e.target.value);
        updatePreview();
    });

    // 笔顺模式
    document.getElementById('strokeMode').addEventListener('change', (e) => {
        state.strokeMode = e.target.checked;
        document.getElementById('strokeHint').style.display = e.target.checked ? 'block' : 'none';
        // 笔顺模式和描红模式互斥
        if (e.target.checked && state.traceMode) {
            state.traceMode = false;
            document.getElementById('traceMode').checked = false;
            document.getElementById('traceOptions').style.display = 'none';
        }
        // 如果开启笔顺模式，加载笔画数据
        if (e.target.checked) {
            loadStrokeData().then(() => updatePreview());
        } else {
            updatePreview();
        }
    });

    // 打卡模式
    document.getElementById('checkInMode').addEventListener('change', (e) => {
        state.checkInMode = e.target.checked;
        document.getElementById('checkInOptions').style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
            // 禁用其他模式
            document.getElementById('traceMode').checked = false;
            document.getElementById('strokeMode').checked = false;
            state.traceMode = false;
            state.strokeMode = false;
            document.getElementById('traceOptions').style.display = 'none';
            document.getElementById('strokeOptions').style.display = 'none';
            // 生成区域内容输入框
            generateCheckInContentInputs();
        }
        updatePreview();
    });

    // 打卡区域数量选择
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.checkInRegions = parseInt(e.target.dataset.regions);
            generateCheckInContentInputs();
            updatePreview();
        });
    });

    // 起始课次
    document.getElementById('checkInStartLesson').addEventListener('change', (e) => {
        state.checkInStartLesson = parseInt(e.target.value) || 1;
        updatePreview();
    });
}

// 处理字符大小变化（只更新显示值）
function handleCharSizeChange(e) {
    state.charSize = parseInt(e.target.value);
    document.getElementById('charSizeValue').textContent = state.charSize + '%';
}

// 应用字符大小（重新渲染预览）
function applySizeChange() {
    updatePreview();
}

// 格子类型切换
function initGridTypeButtons() {
    document.querySelectorAll('.grid-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 更新按钮状态
            document.querySelectorAll('.grid-type-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 更新状态并重新渲染
            state.gridType = e.target.dataset.type;
            updatePreview();
        });
    });
}

// 字符灰度控制初始化
function initOpacityControls() {
    // 预设按钮
    document.querySelectorAll('.opacity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.opacity-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const opacity = parseInt(e.target.dataset.opacity);
            state.charOpacity = opacity;
            document.getElementById('charOpacitySlider').value = opacity;
            document.getElementById('charOpacityValue').textContent = opacity + '%';
            updatePreview();
        });
    });

    // 滑块
    document.getElementById('charOpacitySlider').addEventListener('input', (e) => {
        state.charOpacity = parseInt(e.target.value);
        document.getElementById('charOpacityValue').textContent = state.charOpacity + '%';
        // 更新预设按钮状态
        document.querySelectorAll('.opacity-btn').forEach(btn => btn.classList.remove('active'));
    });

    // 应用按钮
    document.getElementById('applyOpacityBtn').addEventListener('click', () => {
        updatePreview();
    });
}

// 生成打卡区域内容输入框
function generateCheckInContentInputs() {
    const container = document.getElementById('checkInContents');
    container.innerHTML = '';

    for (let i = 0; i < state.checkInRegions; i++) {
        const row = document.createElement('div');
        row.className = 'checkin-content-row';

        const label = document.createElement('span');
        label.className = 'checkin-content-label';
        label.textContent = `区域${i + 1}:`;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'checkin-content-input';
        input.placeholder = `输入${getRowsForRegion(state.checkInRegions)}个汉字`;
        input.value = state.checkInContents[i] || '';
        input.dataset.index = i;
        input.addEventListener('input', (e) => {
            state.checkInContents[parseInt(e.target.dataset.index)] = e.target.value;
            updatePreview();
        });

        row.appendChild(label);
        row.appendChild(input);
        container.appendChild(row);
    }
}

// 根据区域数量获取每区行数
function getRowsForRegion(regions) {
    switch (regions) {
        case 4: return 6;  // 2x2布局，每区6行
        case 6: return 4;  // 2x3布局，每区4行
        case 8: return 3;  // 2x4布局，每区3行
        default: return 4;
    }
}

// 布局控制初始化
function initLayoutControls() {
    // 每行字数按钮
    document.querySelectorAll('.layout-btn[data-cols]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.layout-btn[data-cols]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            LAYOUT.CHARS_PER_ROW = parseInt(e.target.dataset.cols);
            updatePreview();
        });
    });

    // 格子大小按钮
    document.querySelectorAll('.layout-btn[data-size]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 获取按钮（可能点击在small标签上）
            const button = e.target.closest('.layout-btn');
            document.querySelectorAll('.layout-btn[data-size]').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            state.gridSizeMm = parseInt(button.dataset.size);
            calculateMaxRows();
            updatePreview();
        });
    });

    // 显示拼音格复选框
    document.getElementById('showPinyin').addEventListener('change', (e) => {
        state.showPinyin = e.target.checked;
        calculateMaxRows();
        updatePreview();
    });

    // 初始计算行数
    calculateMaxRows();
}

// 根据格子大小计算最大行数
function calculateMaxRows() {
    const gridMm = state.gridSizeMm;
    const pinyinMm = state.showPinyin ? Math.round(gridMm * 0.6) : 0; // 拼音格约为格子高度的60%
    const rowHeightMm = gridMm + pinyinMm;

    // 计算可容纳的行数
    LAYOUT.MAX_ROWS = Math.floor(A4.CONTENT_HEIGHT / rowHeightMm);
}

// 批量设置所有字符的显示模式
function setAllMode(mode) {
    state.chars.forEach(charData => {
        if (mode === DisplayMode.NORMAL) {
            // 全部正常：恢复所有字符（包括标点、字母、数字、空格）
            charData.mode = DisplayMode.NORMAL;
        } else {
            // 仅汉字/仅拼音：只修改汉字，不修改其他类型
            if (charData.type === 'char') {
                charData.mode = mode;
            }
        }
    });

    updatePreview();
}

// 处理文字输入
function handleTextInput(e) {
    const text = e.target.value;
    parseText(text);

    // 如果开启笔顺模式，异步加载笔画数据
    if (state.strokeMode) {
        loadStrokeData().then(() => updatePreview());
    } else {
        updatePreview();
    }
}

// 异步加载汉字笔画数据
async function loadStrokeData() {
    const chineseChars = state.chars
        .filter(c => c.type === 'char' && !state.strokeData[c.char])
        .map(c => c.char);

    // 去重
    const uniqueChars = [...new Set(chineseChars)];

    // 并行加载所有汉字的笔画数据
    const promises = uniqueChars.map(async (char) => {
        try {
            const data = await HanziWriter.loadCharacterData(char);
            state.strokeData[char] = data.strokes.length;
            // 更新已解析的字符的笔画数
            state.chars.forEach(c => {
                if (c.char === char) {
                    c.strokeCount = data.strokes.length;
                }
            });
        } catch (e) {
            console.warn(`无法加载 ${char} 的笔画数据`);
            state.strokeData[char] = 8; // 默认值
        }
    });

    await Promise.all(promises);
}

// 解析文字输入（所有字符均可显示，支持换行）
function parseText(text) {
    state.words = [];
    state.chars = [];

    // 定义所有标点符号和特殊字符（中英文）
    const punctuationRegex = /[，。！？、；：""''（）【】《》…—·,.!?;:"'()\[\]<>~～@#$%^&*_+=|\\\/\-]/;

    let wordIndex = 0;

    let charIndex = 0;

    for (const char of text) {
        if (char === '\n' || char === '\r') {
            // 换行符：添加换行标记
            state.chars.push({
                char: '\n',
                pinyin: '',
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'newline',
                charIndex: charIndex++
            });
            wordIndex++;
        } else if (/[\u4e00-\u9fa5]/.test(char)) {
            // 汉字
            const pinyin = getPinyin(char);
            const allPinyins = getAllPinyins(char);
            const isMulti = allPinyins.length > 1;
            // 获取笔画数（同步方式，使用缓存）
            let strokeCount = 0;
            if (state.strokeData[char]) {
                strokeCount = state.strokeData[char];
            } else {
                // 使用默认值，后续异步加载更新
                strokeCount = 8; // 平均汉字笔画数作为默认值
            }
            state.chars.push({
                char,
                pinyin,
                allPinyins: isMulti ? allPinyins : null, // 多音字存储所有读音
                isPolyphonic: isMulti, // 标记是否为多音字
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'char',
                charIndex: charIndex++,
                strokeCount
            });
            wordIndex++;
        } else if (punctuationRegex.test(char)) {
            // 标点符号：作为占位格显示
            state.chars.push({
                char,
                pinyin: '',
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'punctuation',
                charIndex: charIndex++
            });
            wordIndex++;
        } else if (/[ \t]/.test(char)) {
            // 空格或制表符：作为空白占位格（不包括换行）
            state.chars.push({
                char: ' ',
                pinyin: '',
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'space',
                charIndex: charIndex++
            });
            wordIndex++;
        } else if (/[a-zA-Z]/.test(char)) {
            // 英文字母
            state.chars.push({
                char,
                pinyin: '',
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'letter',
                charIndex: charIndex++
            });
            wordIndex++;
        } else if (/[0-9]/.test(char)) {
            // 数字
            state.chars.push({
                char,
                pinyin: '',
                mode: DisplayMode.NORMAL,
                wordIndex,
                type: 'number',
                charIndex: charIndex++
            });
            wordIndex++;
        }
    }
}

// 获取拼音（带声调）
function getPinyin(char) {
    try {
        // 使用 pinyin-pro 库
        if (window.pinyinPro && window.pinyinPro.pinyin) {
            return window.pinyinPro.pinyin(char, { toneType: 'symbol' });
        }
    } catch (e) {
        console.error('拼音获取失败:', e);
    }
    return '';
}

// 获取所有可能的拼音（多音字检测）
function getAllPinyins(char) {
    try {
        if (window.pinyinPro && window.pinyinPro.pinyin) {
            // 使用 multiple: true 获取所有读音
            const result = window.pinyinPro.pinyin(char, {
                toneType: 'symbol',
                multiple: true
            });
            // 返回去重后的拼音数组
            const pinyins = result.split(' ');
            return [...new Set(pinyins)];
        }
    } catch (e) {
        console.error('多音字检测失败:', e);
    }
    return [];
}

// 检测是否为多音字
function isPolyphonic(char) {
    const pinyins = getAllPinyins(char);
    return pinyins.length > 1;
}

// 字符列表已移除，使用预览区点击切换模式

// 循环切换显示模式
function cycleMode(index) {
    const charData = state.chars[index];
    // 标点符号、字母、数字、空格只在 正常 和 隐藏 之间切换
    if (['punctuation', 'letter', 'number', 'space'].includes(charData.type)) {
        charData.mode = charData.mode === DisplayMode.NORMAL ? DisplayMode.HIDDEN : DisplayMode.NORMAL;
    } else {
        // 汉字有4种模式
        const modes = [DisplayMode.NORMAL, DisplayMode.CHAR_ONLY, DisplayMode.PINYIN_ONLY, DisplayMode.HIDDEN];
        const currentIndex = modes.indexOf(charData.mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        charData.mode = modes[nextIndex];
    }

    updatePreview();
}

// 显示多音字选择弹窗
function showPolyphonicSelector(charIndex, event) {
    const charData = state.chars[charIndex];
    if (!charData || !charData.isPolyphonic || !charData.allPinyins) return;

    // 移除已有的弹窗
    const existingPopup = document.getElementById('polyphonicPopup');
    if (existingPopup) existingPopup.remove();

    // 创建弹窗
    const popup = document.createElement('div');
    popup.id = 'polyphonicPopup';
    popup.className = 'polyphonic-popup';

    // 标题
    const title = document.createElement('div');
    title.className = 'popup-title';
    title.innerHTML = `「<span class="popup-char">${charData.char}</span>」选择读音`;
    popup.appendChild(title);

    // 读音选项
    const options = document.createElement('div');
    options.className = 'popup-options';
    charData.allPinyins.forEach(py => {
        const btn = document.createElement('button');
        btn.className = 'pinyin-option' + (py === charData.pinyin ? ' active' : '');
        btn.textContent = py;
        btn.onclick = () => selectPinyin(charIndex, py);
        options.appendChild(btn);
    });
    popup.appendChild(options);

    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => popup.remove();
    popup.appendChild(closeBtn);

    // 定位弹窗
    document.body.appendChild(popup);
    const rect = event.target.getBoundingClientRect();
    popup.style.left = Math.min(rect.left, window.innerWidth - popup.offsetWidth - 10) + 'px';
    popup.style.top = (rect.bottom + 5) + 'px';

    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

// 选择拼音
function selectPinyin(charIndex, pinyin) {
    state.chars[charIndex].pinyin = pinyin;
    const popup = document.getElementById('polyphonicPopup');
    if (popup) popup.remove();
    updatePreview();
}

// 处理颜色变化
function handleColorChange(e) {
    state.borderColor = e.target.value;
    elements.colorValue.textContent = state.borderColor;
    updatePreview();
}

// 更新预览（多页支持）
function updatePreview() {
    const container = elements.pagesContainer;
    container.innerHTML = '';

    // 打卡模式使用专门的渲染
    if (state.checkInMode) {
        const page = renderCheckInPage();
        container.appendChild(page);
        applyFont(state.currentFont);
        return;
    }

    // 按行排列字符
    const allRows = layoutChars();

    // 计算需要的页数
    const charsPerPage = LAYOUT.MAX_ROWS;
    const totalPages = Math.max(1, Math.ceil(allRows.length / charsPerPage));

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const page = createPage(pageIndex, totalPages, allRows);
        container.appendChild(page);
    }

    // 应用当前字体
    applyFont(state.currentFont);
}

// 渲染打卡页面
function renderCheckInPage() {
    const page = document.createElement('div');
    page.className = 'a4-paper checkin-page';

    // 应用当前字体
    page.style.fontFamily = `"${state.currentFont}", "LXGW WenKai GB", KaiTi, FangSong, serif`;

    const grid = document.createElement('div');
    grid.className = `checkin-grid regions-${state.checkInRegions}`;

    const rows = getRowsForRegion(state.checkInRegions);
    const cols = 8; // 固定8列：1范字 + 3描红 + 4空白

    for (let i = 0; i < state.checkInRegions; i++) {
        const card = createCheckInCard(i, rows, cols);
        grid.appendChild(card);
    }

    page.appendChild(grid);
    return page;
}

// 创建单个打卡卡片
function createCheckInCard(index, rows, cols) {
    const card = document.createElement('div');
    card.className = 'checkin-card';

    // 根据区域数量设置字体大小 - 保持比例一致
    const charSizeMap = { 4: '9mm', 6: '8mm', 8: '8.5mm' };
    const pinyinSizeMap = { 4: '3.5mm', 6: '3.2mm', 8: '3.5mm' };
    card.style.setProperty('--card-char-size', charSizeMap[state.checkInRegions] || '7mm');
    card.style.setProperty('--card-pinyin-size', pinyinSizeMap[state.checkInRegions] || '3mm');
    card.style.setProperty('--card-rows', rows);

    // 标题
    const header = document.createElement('div');
    header.className = 'card-header';
    header.textContent = '每 日 打 卡';
    card.appendChild(header);

    // 信息行
    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
        <span>第___天打卡</span>
        <span>姓名：____________</span>
    `;
    card.appendChild(info);

    // 格子区域
    const gridContainer = document.createElement('div');
    gridContainer.className = 'card-grid-container';

    // 获取该区域的内容
    const content = state.checkInContents[index] || '';
    const chars = content.replace(/\s/g, '').split('').slice(0, rows);

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'card-row';

        const char = chars[r] || '';
        const pinyin = char ? getPinyin(char) : '';
        // 获取笔画数
        const strokeCount = char && state.strokeData[char] ? state.strokeData[char] : 0;

        // 创建一个新的行结构：拼音行 + 汉字行
        // 拼音行：第一格拼音 + 后续格合并显示笔顺
        const pinyinRow = document.createElement('div');
        pinyinRow.className = 'card-pinyin-row';

        // 第一格的拼音
        const firstPinyin = document.createElement('div');
        firstPinyin.className = 'card-first-pinyin';
        firstPinyin.textContent = pinyin || '';
        pinyinRow.appendChild(firstPinyin);

        // 后续格合并的笔顺区
        const strokeOrderArea = document.createElement('div');
        strokeOrderArea.className = 'card-stroke-order';
        if (char) {
            // 直接加载笔顺数据，不依赖state.strokeData预加载
            loadStrokeOrderText(char, strokeOrderArea);
        }
        pinyinRow.appendChild(strokeOrderArea);

        row.appendChild(pinyinRow);

        // 汉字行：8个格子
        const charRow = document.createElement('div');
        charRow.className = 'card-char-row';

        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'card-char-cell';

            if (char) {
                const charSpan = document.createElement('span');
                charSpan.className = 'char-text';

                if (c === 0) {
                    // 范字（正常显示）
                    charSpan.textContent = char;
                } else if (c <= 3) {
                    // 描红（浅色）
                    charSpan.textContent = char;
                    charSpan.classList.add('trace');
                }
                // c > 3 时为空白格，不显示文字

                cell.appendChild(charSpan);
            }

            charRow.appendChild(cell);
        }

        row.appendChild(charRow);
        gridContainer.appendChild(row);
    }

    card.appendChild(gridContainer);

    // 添加footer
    addCheckInCardFooter(card, index);

    return card;
}

// 加载并显示笔顺序列图形
function loadStrokeOrderText(char, container) {
    if (!window.HanziWriter) {
        container.textContent = '笔顺：';
        return;
    }

    // 添加"笔顺："前缀
    const prefix = document.createElement('span');
    prefix.textContent = '笔顺：';
    prefix.style.marginRight = '1mm';
    container.appendChild(prefix);

    HanziWriter.loadCharacterData(char).then(charData => {
        if (!charData || !charData.strokes) {
            return;
        }

        const strokes = charData.strokes;
        const strokeCount = strokes.length;

        // 为每一笔创建一个小SVG显示累积笔画
        for (let i = 0; i < strokeCount; i++) {
            const strokeBox = document.createElement('div');
            strokeBox.style.cssText = 'display:inline-block;width:4mm;height:4mm;margin:0 0.3mm;vertical-align:middle;';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 1024 1024');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');

            // 绘制从第1笔到第i+1笔的累积笔画
            for (let j = 0; j <= i; j++) {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', strokes[j]);
                // 最后一笔用深色，之前的用浅色
                path.setAttribute('fill', j === i ? '#333' : '#ccc');

                // 添加翻转变换（HanziWriter数据需要翻转）
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', 'scale(1, -1) translate(0, -900)');
                g.appendChild(path);
                svg.appendChild(g);
            }

            strokeBox.appendChild(svg);
            container.appendChild(strokeBox);
        }
    }).catch(() => {
        container.textContent = '笔顺：加载失败';
    });
}

// 为打卡卡片添加footer（在createCheckInCard中调用）
function addCheckInCardFooter(card, index) {
    // 评分区
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `
        <div class="card-rating">
            <span>书写:☆☆☆</span>
            <span>坐姿:☆☆☆</span>
            <span>握姿:☆☆☆</span>
        </div>
        <div class="card-lesson">
            ___年__月__日&nbsp;&nbsp;&nbsp;第 <strong>${state.checkInStartLesson + index}</strong> 课
        </div>
    `;
    card.appendChild(footer);
}

// 创建单个页面
function createPage(pageIndex, totalPages, allRows) {
    const page = document.createElement('div');
    page.className = 'a4-paper';
    page.style.setProperty('--grid-border-color', state.borderColor);

    // 动态设置格子大小（mm转px，96dpi下 1mm ≈ 3.78px，但屏幕预览需要适配）
    // A4纸宽210mm，预览宽度约794px，所以比例约 794/210 ≈ 3.78
    const pxPerMm = 3.78;
    const gridSizePx = Math.round(state.gridSizeMm * pxPerMm);
    const pinyinSizePx = state.showPinyin ? Math.round(gridSizePx * 0.6) : 0;
    page.style.setProperty('--grid-size', gridSizePx + 'px');
    page.style.setProperty('--pinyin-height', pinyinSizePx + 'px');

    // 标题（只在第一页显示）
    if (pageIndex === 0) {
        const title = document.createElement('div');
        title.className = 'paper-title';
        title.textContent = state.title || '';
        page.appendChild(title);

        // 学生信息栏
        if (state.showName || state.showClass || state.showDate) {
            const infoBar = document.createElement('div');
            infoBar.className = 'student-info-bar';

            if (state.showName) {
                const nameItem = document.createElement('span');
                nameItem.className = 'info-item';
                nameItem.innerHTML = '姓名：<span class="info-line"></span>';
                infoBar.appendChild(nameItem);
            }
            if (state.showClass) {
                const classItem = document.createElement('span');
                classItem.className = 'info-item';
                classItem.innerHTML = '班级：<span class="info-line"></span>';
                infoBar.appendChild(classItem);
            }
            if (state.showDate) {
                const dateItem = document.createElement('span');
                dateItem.className = 'info-item';
                dateItem.innerHTML = '日期：<span class="info-line"></span>';
                infoBar.appendChild(dateItem);
            }

            page.appendChild(infoBar);
        }
    }

    // 内容区
    const content = document.createElement('div');
    content.className = 'copybook-content';

    // 计算当前页的行范围
    const startRow = pageIndex * LAYOUT.MAX_ROWS;
    const endRow = Math.min(startRow + LAYOUT.MAX_ROWS, allRows.length);
    const pageRows = allRows.slice(startRow, endRow);

    // 计算当前页的起始单元格索引
    let cellIndex = startRow * LAYOUT.CHARS_PER_ROW;

    // 渲染当前页的行
    pageRows.forEach((row, rowIdx) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'copybook-row';

        row.forEach(charData => {
            const cell = createCharCell(charData, cellIndex);
            rowDiv.appendChild(cell);
            cellIndex++;
        });

        // 填充当前行剩余空格
        const remaining = LAYOUT.CHARS_PER_ROW - row.length;
        for (let i = 0; i < remaining; i++) {
            const emptyCell = createCharCell(null, cellIndex);
            rowDiv.appendChild(emptyCell);
            cellIndex++;
        }

        content.appendChild(rowDiv);
    });

    // 填充剩余空行
    const remainingRows = LAYOUT.MAX_ROWS - pageRows.length;
    for (let i = 0; i < remainingRows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'copybook-row';
        for (let j = 0; j < LAYOUT.CHARS_PER_ROW; j++) {
            const emptyCell = createCharCell(null, cellIndex);
            rowDiv.appendChild(emptyCell);
            cellIndex++;
        }
        content.appendChild(rowDiv);
    }

    page.appendChild(content);

    // 结束语（只在最后一页显示）
    if (pageIndex === totalPages - 1) {
        const ending = document.createElement('div');
        ending.className = 'paper-ending';
        ending.textContent = state.ending || '';
        page.appendChild(ending);
    }

    // 评分区（每页都显示）
    if (state.showRating) {
        const ratingSection = document.createElement('div');
        ratingSection.className = 'rating-section';
        ratingSection.innerHTML = `
            <div class="rating-stars">
                <span>评分：</span>
                <span class="rating-star">☆</span>
                <span class="rating-star">☆</span>
                <span class="rating-star">☆</span>
                <span class="rating-star">☆</span>
                <span class="rating-star">☆</span>
            </div>
            <div class="rating-comment">
                <span>评语：</span>
                <span class="comment-line"></span>
            </div>
        `;
        page.appendChild(ratingSection);
    }

    // 页脚
    const footer = document.createElement('div');
    footer.className = 'paper-footer';
    footer.innerHTML = `<span>第 ${pageIndex + 1} / ${totalPages} 页</span>`;
    page.appendChild(footer);

    return page;
}

// 布局字符（处理词组不跨行）
function layoutChars() {
    const rows = [];
    let currentRow = [];

    // 描红模式：扩展字符列表
    let expandedChars = state.chars;
    if (state.traceMode) {
        expandedChars = [];
        state.chars.forEach(charData => {
            if (charData.type === 'char') {
                // 汉字：重复 traceCount 次，带 traceIndex
                for (let i = 0; i < state.traceCount; i++) {
                    expandedChars.push({
                        ...charData,
                        traceIndex: i // 0=原字，1+=描红
                    });
                }
            } else {
                // 非汉字：直接复制
                expandedChars.push({ ...charData, traceIndex: 0 });
            }
        });
    } else if (state.strokeMode) {
        // 笔顺模式：根据笔画数扩展字符，每个字的笔画后补空格填满行
        expandedChars = [];
        let positionInRow = 0; // 当前行位置

        state.chars.forEach(charData => {
            if (charData.type === 'char' && charData.strokeCount > 0) {
                const strokes = charData.strokeCount;

                // 如果当前行剩余空间不够放完整的笔画序列，先填满当前行
                if (positionInRow > 0 && positionInRow + strokes > LAYOUT.CHARS_PER_ROW) {
                    // 填充空格到行末
                    while (positionInRow < LAYOUT.CHARS_PER_ROW) {
                        expandedChars.push({ type: 'space', char: ' ', strokeIndex: 0 });
                        positionInRow++;
                    }
                    positionInRow = 0;
                }

                // 添加笔画序列
                for (let i = 1; i <= strokes; i++) {
                    expandedChars.push({
                        ...charData,
                        strokeIndex: i,
                        totalStrokes: strokes
                    });
                    positionInRow++;
                    if (positionInRow >= LAYOUT.CHARS_PER_ROW) {
                        positionInRow = 0;
                    }
                }

                // 如果笔画没有填满行，补空格
                if (positionInRow > 0) {
                    while (positionInRow < LAYOUT.CHARS_PER_ROW) {
                        expandedChars.push({ type: 'space', char: ' ', strokeIndex: 0 });
                        positionInRow++;
                    }
                    positionInRow = 0;
                }
            } else if (charData.type === 'newline') {
                // 换行符：补满当前行
                if (positionInRow > 0) {
                    while (positionInRow < LAYOUT.CHARS_PER_ROW) {
                        expandedChars.push({ type: 'space', char: ' ', strokeIndex: 0 });
                        positionInRow++;
                    }
                    positionInRow = 0;
                }
            } else if (charData.type === 'space') {
                // 空格在笔顺模式下忽略
            } else {
                // 其他非汉字字符（标点等）：忽略
            }
        });
    }

    // 简单布局：直接按顺序排列
    expandedChars.forEach(charData => {
        if (charData.type === 'newline') {
            // 换行：结束当前行
            if (currentRow.length > 0) {
                rows.push(currentRow);
                currentRow = [];
            }
        } else {
            currentRow.push(charData);
            if (currentRow.length >= LAYOUT.CHARS_PER_ROW) {
                rows.push(currentRow);
                currentRow = [];
            }
        }
    });
    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
}

// 创建字符单元格
function createCharCell(charData, charIndex = -1) {
    const cell = document.createElement('div');
    cell.className = 'char-cell';

    // 如果有字符数据且有索引，添加点击事件用于切换模式
    if (charData && charData.charIndex >= 0) {
        cell.dataset.charIndex = charData.charIndex;
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => {
            cycleMode(charData.charIndex);
        });

        // 多音字：右键点击选择读音
        if (charData.isPolyphonic) {
            cell.classList.add('polyphonic');
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showPolyphonicSelector(charData.charIndex, e);
            });
        }
    }

    // 每100个格子添加计数标记（基于单元格位置，不是字符索引）
    if (charIndex >= 0) {
        const position = charIndex + 1; // 转为1-indexed
        if (position > 0 && position % 100 === 0) {
            const counter = document.createElement('span');
            counter.className = 'cell-counter';
            counter.textContent = position;
            cell.appendChild(counter);
        }
    }

    // 拼音格子
    const pinyinGrid = document.createElement('div');
    pinyinGrid.className = 'pinyin-grid';

    // 米字格
    const miGrid = document.createElement('div');
    miGrid.className = 'mi-grid';

    // 根据格子类型添加线条
    // 米字格: 十字 + 对角线
    // 田字格: 只有十字
    // 口字格: 无线条

    if (state.gridType === 'mi' || state.gridType === 'tian') {
        // 十字线（米字格和田字格都有）
        const lineH = document.createElement('div');
        lineH.className = 'grid-line line-horizontal';
        miGrid.appendChild(lineH);

        const lineV = document.createElement('div');
        lineV.className = 'grid-line line-vertical';
        miGrid.appendChild(lineV);
    }

    if (state.gridType === 'mi') {
        // 对角线（只有米字格有）
        const lineD1 = document.createElement('div');
        lineD1.className = 'grid-line line-diagonal-1';
        miGrid.appendChild(lineD1);

        const lineD2 = document.createElement('div');
        lineD2.className = 'grid-line line-diagonal-2';
        miGrid.appendChild(lineD2);
    }

    if (charData && charData.mode !== DisplayMode.HIDDEN) {
        // 计算当前字体大小 - 基于格子大小动态计算
        const pxPerMm = 3.78;
        const gridSizePx = state.gridSizeMm * pxPerMm;
        const baseFontSize = gridSizePx * 0.85; // 字体约为格子的85%
        const scale = state.charSize / 100;
        const charFontSize = Math.round(baseFontSize * scale) + 'px';
        const puncFontSize = Math.round(baseFontSize * 0.7 * scale) + 'px'; // 标点小一些
        // 拼音字体 - 基于拼音格子高度（约为格子的50%）的70%
        const pinyinGridHeight = gridSizePx * 0.6;
        const pinyinFontSize = Math.round(pinyinGridHeight * 0.7) + 'px';

        // 透明度：描红模式下，首格正常，后续描红格更浅
        let opacity = state.charOpacity / 100;
        if (charData.traceIndex && charData.traceIndex > 0) {
            opacity = 0.25; // 描红格固定浅灰色
        }

        // 空格处理：显示为空白格（不显示任何内容）
        if (charData.type === 'space') {
            // 空格格子保持空白
        }
        // 标点符号处理
        else if (charData.type === 'punctuation') {
            const charText = document.createElement('span');
            charText.className = 'char-text-display punctuation-text';
            charText.textContent = charData.char;
            charText.style.fontSize = puncFontSize;
            charText.style.opacity = opacity;
            miGrid.appendChild(charText);
        }
        // 字母处理
        else if (charData.type === 'letter') {
            const charText = document.createElement('span');
            charText.className = 'char-text-display letter-text';
            charText.textContent = charData.char;
            charText.style.fontSize = charFontSize;
            charText.style.opacity = opacity;
            miGrid.appendChild(charText);
        }
        // 数字处理
        else if (charData.type === 'number') {
            const charText = document.createElement('span');
            charText.className = 'char-text-display number-text';
            charText.textContent = charData.char;
            charText.style.fontSize = charFontSize;
            charText.style.opacity = opacity;
            miGrid.appendChild(charText);
        } else {
            // 汉字处理
            // 显示拼音：正常模式 或 仅拼音模式
            if (charData.mode === DisplayMode.NORMAL || charData.mode === DisplayMode.PINYIN_ONLY) {
                const pinyinText = document.createElement('span');
                pinyinText.className = 'pinyin-text';
                pinyinText.textContent = charData.pinyin;

                // 根据拼音长度动态调整字体大小（防止长拼音溢出）
                const pinyinLen = charData.pinyin.length;
                let adjustedPinyinSize = parseFloat(pinyinFontSize);
                if (pinyinLen >= 6) {
                    adjustedPinyinSize *= 0.75; // 6字符以上缩小25%
                } else if (pinyinLen >= 5) {
                    adjustedPinyinSize *= 0.85; // 5字符缩小15%
                }
                pinyinText.style.fontSize = Math.round(adjustedPinyinSize) + 'px';
                pinyinText.style.opacity = opacity;
                // 根据格子大小动态调整拼音位置（基础往上5px，较大格子按比例往上调整更多）
                const marginAdjust = Math.round((state.gridSizeMm - 12) / 3);
                pinyinText.style.marginTop = (-5 - marginAdjust) + 'px';
                pinyinGrid.appendChild(pinyinText);
            }

            // 显示汉字：正常模式 或 仅汉字模式
            if (charData.mode === DisplayMode.NORMAL || charData.mode === DisplayMode.CHAR_ONLY) {
                // 笔顺模式：使用 Hanzi Writer 渲染部分笔画
                if (charData.strokeIndex && charData.strokeIndex > 0) {
                    // 创建 Hanzi Writer 容器
                    const writerDiv = document.createElement('div');
                    writerDiv.className = 'hanzi-writer-container';
                    writerDiv.style.width = charFontSize;
                    writerDiv.style.height = charFontSize;
                    writerDiv.style.opacity = opacity;
                    miGrid.appendChild(writerDiv);

                    // 使用 Hanzi Writer 渲染
                    const size = parseInt(charFontSize);

                    // 异步加载并渲染笔画
                    (async () => {
                        try {
                            // 加载汉字数据
                            const charDataResult = await HanziWriter.loadCharacterData(charData.char);
                            const strokes = charDataResult.strokes;

                            // 创建 SVG（需要垂直翻转，因为Hanzi Writer使用Y轴向上的坐标系）
                            // viewBox调整：原始0 0 1024 1024，汉字数据有内边距，需要向上移动约5%以视觉居中
                            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            svg.setAttribute('width', size);
                            svg.setAttribute('height', size);
                            svg.setAttribute('viewBox', '0 -120 1024 1024'); // 上移120单位使汉字视觉居中
                            svg.style.display = 'block';
                            svg.style.transform = 'scaleY(-1)'; // 垂直翻转
                            // 渲染前 strokeIndex 笔
                            for (let i = 0; i < Math.min(charData.strokeIndex, strokes.length); i++) {
                                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                path.setAttribute('d', strokes[i]);
                                path.setAttribute('fill', '#333');
                                path.setAttribute('stroke', 'none');
                                // 最后一笔用红色高亮
                                if (i === charData.strokeIndex - 1) {
                                    path.setAttribute('fill', '#e53935');
                                }
                                svg.appendChild(path);
                            }

                            writerDiv.appendChild(svg);
                        } catch (e) {
                            // 如果加载失败，显示普通文字
                            console.warn('笔画加载失败:', charData.char, e);
                            const charText = document.createElement('span');
                            charText.className = 'char-text-display';
                            charText.textContent = charData.char;
                            charText.style.fontSize = charFontSize;
                            charText.style.opacity = opacity;
                            writerDiv.appendChild(charText);
                        }
                    })();

                    // 在拼音区显示笔画序号
                    const strokeLabel = document.createElement('span');
                    strokeLabel.className = 'stroke-label';
                    strokeLabel.textContent = `${charData.strokeIndex}/${charData.totalStrokes}`;
                    strokeLabel.style.fontSize = Math.round(parseFloat(pinyinFontSize) * 0.9) + 'px';
                    pinyinGrid.innerHTML = ''; // 清空拼音
                    pinyinGrid.appendChild(strokeLabel);
                } else {
                    // 普通模式：显示汉字
                    const charText = document.createElement('span');
                    charText.className = 'char-text-display';
                    charText.textContent = charData.char;
                    charText.style.fontSize = charFontSize;
                    charText.style.opacity = opacity;
                    miGrid.appendChild(charText);
                }
            }
        }
    }

    // 根据设置决定是否显示拼音格
    if (state.showPinyin) {
        cell.appendChild(pinyinGrid);
    }
    cell.appendChild(miGrid);

    return cell;
}

// 渲染空白页面
function renderEmptyPage(content) {
    for (let i = 0; i < LAYOUT.MAX_ROWS; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'copybook-row';
        for (let j = 0; j < LAYOUT.CHARS_PER_ROW; j++) {
            const emptyCell = createCharCell(null);
            rowDiv.appendChild(emptyCell);
        }
        content.appendChild(rowDiv);
    }
}

// 导出 PDF（多页支持）
async function exportToPdf() {
    const btn = elements.exportPdf;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> 生成中...';
    btn.disabled = true;

    try {
        const pages = elements.pagesContainer.querySelectorAll('.a4-paper');

        if (pages.length === 0) {
            alert('没有内容可导出');
            return;
        }

        // 创建 PDF (A4尺寸)
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = 210;
        const pdfHeight = 297;

        // 遍历每一页
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            // 如果不是第一页，添加新页
            if (i > 0) {
                pdf.addPage();
            }

            // 使用 html2canvas 将页面转为图片
            const canvas = await html2canvas(page, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            // 将图片添加到 PDF（填满整页）
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        // 下载
        const timestamp = new Date().toISOString().slice(0, 10);
        pdf.save(`字帖_${timestamp}.pdf`);

    } catch (error) {
        console.error('PDF导出失败:', error);
        alert('PDF导出失败，请重试');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 导出为PNG图片（每页单独导出）
async function exportToPng() {
    const btn = document.getElementById('exportPng');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = '<span class="btn-icon">⏳</span> 导出中...';
        btn.disabled = true;

        const pages = document.querySelectorAll('.a4-paper');
        const timestamp = new Date().toISOString().slice(0, 10);

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];

            // 使用 html2canvas 将页面转为图片
            const canvas = await html2canvas(page, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            // 创建下载链接
            const link = document.createElement('a');
            const pageNum = pages.length > 1 ? `_p${i + 1}` : '';
            link.download = `字帖_${timestamp}${pageNum}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // 多页时延迟下载避免浏览器拦截
            if (pages.length > 1 && i < pages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        if (pages.length > 1) {
            alert(`已导出 ${pages.length} 张图片`);
        }

    } catch (error) {
        console.error('图片导出失败:', error);
        alert('图片导出失败，请重试');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ===== 字体功能 =====

// 处理字体切换
function handleFontChange(e) {
    const fontName = e.target.value;
    state.currentFont = fontName;
    applyFont(fontName);
    showFontStatus(`已切换到: ${fontName}`, 'success');
}

// 应用字体到预览区
function applyFont(fontName) {
    const container = elements.pagesContainer;
    container.querySelectorAll('.a4-paper').forEach(page => {
        page.style.setProperty('--char-font', `'${fontName}', serif`);
    });

    // 更新所有汉字和拼音的字体
    document.querySelectorAll('.char-text-display, .pinyin-text').forEach(el => {
        el.style.fontFamily = `'${fontName}', serif`;
    });
}

// 处理字体上传
async function handleFontUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, ''); // 去除扩展名
    const fontName = `Custom-${fileName}`;

    showFontStatus('正在加载字体...', '');

    try {
        // 创建字体 URL
        const fontUrl = URL.createObjectURL(file);

        // 使用 FontFace API 加载字体
        const font = new FontFace(fontName, `url(${fontUrl})`);
        await font.load();

        // 添加到文档
        document.fonts.add(font);

        // 添加到下拉列表
        const option = document.createElement('option');
        option.value = fontName;
        option.textContent = `📁 ${fileName} (已上传)`;
        elements.fontSelect.appendChild(option);

        // 选中并应用
        elements.fontSelect.value = fontName;
        state.currentFont = fontName;
        applyFont(fontName);

        showFontStatus(`✓ 已加载: ${fileName}`, 'success');
    } catch (error) {
        console.error('字体加载失败:', error);
        showFontStatus('✗ 字体加载失败', 'error');
    }
}

// 检测本机字体
async function detectLocalFonts() {
    // 检查浏览器是否支持 Local Font Access API
    if (!('queryLocalFonts' in window)) {
        showFontStatus('⚠ 浏览器不支持检测本机字体', 'error');
        alert('您的浏览器不支持 Local Font Access API。\n请使用 Chrome 103+ 或 Edge 103+ 版本。');
        return;
    }

    showFontStatus('正在检测本机字体...', '');

    try {
        // 请求字体访问权限
        const fonts = await window.queryLocalFonts();

        // 筛选中文字体（通过常见中文字体名称）
        const chineseFontKeywords = ['宋', '黑', '楷', '仿', '隶', '圆', '雅', '华文', 'Hei', 'Song', 'Kai', 'Ming', 'SimSun', 'SimHei', 'Microsoft YaHei', 'PingFang', 'Noto Sans CJK', 'Source Han'];

        const uniqueFonts = new Set();
        fonts.forEach(font => {
            const family = font.family;
            // 检查是否可能是中文字体
            const isChinese = chineseFontKeywords.some(kw => family.includes(kw));
            if (isChinese && !uniqueFonts.has(family)) {
                uniqueFonts.add(family);
            }
        });

        if (uniqueFonts.size === 0) {
            showFontStatus('未检测到中文字体', 'error');
            return;
        }

        // 添加分隔线
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '── 本机字体 ──';
        elements.fontSelect.appendChild(separator);

        // 添加到下拉列表
        uniqueFonts.forEach(fontFamily => {
            const option = document.createElement('option');
            option.value = fontFamily;
            option.textContent = `💻 ${fontFamily}`;
            elements.fontSelect.appendChild(option);
        });

        showFontStatus(`✓ 检测到 ${uniqueFonts.size} 个中文字体`, 'success');
    } catch (error) {
        console.error('检测字体失败:', error);
        if (error.name === 'SecurityError') {
            showFontStatus('⚠ 用户拒绝了字体访问权限', 'error');
        } else {
            showFontStatus('✗ 检测失败', 'error');
        }
    }
}

// 显示字体状态
function showFontStatus(message, type) {
    elements.fontStatus.textContent = message;
    elements.fontStatus.className = 'font-load-status ' + type;
}
