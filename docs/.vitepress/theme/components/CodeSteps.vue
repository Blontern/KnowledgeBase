<!-- components/CodeSteps.vue -->
<template>
    <div class="code-steps-container">
        <div class="code-header">
            <div class="language-indicator">{{ lang }}</div>
            <div class="step-indicator">
                <span v-if="maxStep > 0">步骤 {{ currentStep }} / {{ maxStep }}</span>
                <span v-else>静态代码</span>
            </div>
        </div>

        <div class="code-block" ref="codeBlock" v-html="highlightedCode"></div>

        <div v-if="maxStep > 0" class="controls">
            <button class="control-btn prev-btn" :disabled="currentStep === 0" @click="prevStep">
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                </svg>
                上一步
            </button>

            <div class="step-slider">
                <input type="range" min="0" :max="maxStep" v-model="currentStep" class="slider">
            </div>

            <button class="control-btn next-btn" :disabled="currentStep === maxStep" @click="nextStep">
                下一步
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
            </button>
        </div>

        <div v-if="maxStep > 0" class="reset-container">
            <button class="reset-btn" @click="reset">
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
                重置动画
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { createHighlighter } from 'shiki';
import {
    transformerNotationDiff,
    transformerNotationFocus,
    transformerNotationHighlight,
    transformerNotationErrorLevel,
    transformerCompactLineOptions
} from '@shikijs/transformers';

export default {
    props: {
        code: {
            type: String,
            required: true
        },
        lang: {
            type: String,
            default: 'javascript'
        }
    },

    setup(props) {
        const isDarkMode = ref(false);
        const codeBlock = ref(null);
        const currentStep = ref(0);
        const maxStep = ref(0);
        const highlightedCode = ref('');
        const highlighter = ref(null);
        let observer = null;

        // 解析代码并提取步骤信息
        const parsedCode = computed(() => {
            const lines = props.code.split('\n');
            const stepRegex = /\/\/\s*\[!step\s+(\d+)\s*([+-]{2})?\]/;
            const result = [];
            let maxStepFound = 0;
            let hasSteps = false;

            lines.forEach((line, index) => {
                const match = line.match(stepRegex);
                let content = line;
                let step = 0;
                let state = null;

                if (match) {
                    hasSteps = true;
                    step = parseInt(match[1]);
                    state = match[2] || '++';

                    if (step > maxStepFound) maxStepFound = step;

                    // 移除步骤标记
                    content = line.replace(stepRegex, '').trim();

                    // 对于删除行，最大步骤应该是 step + 1
                    if (state === '--' && step + 1 > maxStepFound) {
                        maxStepFound = step + 1;
                    }
                }

                result.push({
                    content,
                    step,
                    state,
                    originalIndex: index
                });
            });

            maxStep.value = hasSteps ? maxStepFound : 0;
            return result;
        });

        // 添加主题切换监听
        const checkDarkMode = () => {
            isDarkMode.value = document.documentElement.classList.contains('dark');
        };

        onMounted(() => {
            checkDarkMode();
            // 创建 MutationObserver 监听主题变化
            observer = new MutationObserver(checkDarkMode);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
            });

            initHighlighter();
            if (maxStep.value === 0) {
                currentStep.value = 0;
            }
        });

        // 获取当前步骤应显示的代码行
        const displayedLines = computed(() => {
            const lines = [];

            parsedCode.value.forEach((line) => {
                let showLine = true;
                let classes = [];

                // 处理删除标记
                if (line.state === '--') {
                    // 在 step <= n 时显示，在 step == n+1 时移除
                    showLine = currentStep.value <= line.step;

                    // 在 step == n 时标记为 removed
                    if (currentStep.value === line.step) {
                        classes.push('diff remove');
                    }
                }
                // 处理新增标记
                else if (line.state === '++') {
                    // 在 step >= n 时显示
                    showLine = currentStep.value >= line.step;

                    // 在 step == n 时标记为 added
                    if (currentStep.value === line.step) {
                        classes.push('diff add');
                    }
                }

                if (showLine) {
                    lines.push({
                        content: line.content,
                        classes: classes.join(' ')
                    });
                }
            });

            return lines;
        });

        // 获取当前步骤的代码字符串
        const currentStepCode = computed(() => {
            return displayedLines.value.map(line => line.content).join('\n');
        });

        // 初始化Shiki高亮器
        const initHighlighter = async () => {
            highlighter.value = await createHighlighter({
                themes: ['github-light', 'github-dark'],
                langs: [props.lang]
            });
            updateHighlightedCode();
        };

        // 更新高亮代码
        const updateHighlightedCode = async () => {
            if (!highlighter.value) return;

            const code = currentStepCode.value;
            const theme = isDarkMode.value ? 'github-dark' : 'github-light';

            // 使用Shiki高亮代码
            const result = highlighter.value.codeToHtml(code, {
                lang: props.lang,
                theme: theme,
                transformers: [
                    transformerNotationDiff({ matchAlgorithm: 'v3' }),
                    transformerNotationFocus({ matchAlgorithm: 'v3' }),
                    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
                    transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
                    transformerCompactLineOptions(),
                    {
                        name: 'custom-line-classes',
                        line(node, line) {
                            const lineData = displayedLines.value[line - 1];
                            if (lineData && lineData.classes) {
                                this.addClassToHast(node, lineData.classes);
                            }
                            return node;
                        }
                    }
                ]
            });

            highlightedCode.value = result;
        };

        // 监听主题变化
        watch(isDarkMode, updateHighlightedCode);

        // 上一步导航
        const prevStep = () => {
            if (currentStep.value > 0) {
                currentStep.value--;
            }
        };

        // 下一步导航
        const nextStep = () => {
            if (currentStep.value < maxStep.value) {
                currentStep.value++;
            }
        };

        // 重置到初始状态
        const reset = () => {
            currentStep.value = 0;
        };

        // 监听步骤变化更新高亮
        watch(currentStep, updateHighlightedCode);
        watch(currentStepCode, updateHighlightedCode);

        // 组件挂载时初始化
        onMounted(() => {
            initHighlighter();
            // 如果没有步骤标记，重置为0
            if (maxStep.value === 0) {
                currentStep.value = 0;
            }
        });

        return {
            codeBlock,
            currentStep,
            maxStep,
            displayedLines,
            highlightedCode,
            prevStep,
            nextStep,
            reset
        };
    }
};
</script>

<style scoped>
.code-steps-container {
    background: var(--vp-code-block-bg);
    border-radius: 8px;
    overflow: hidden;
    margin: 1.5rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.code-steps-container:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #3c3c3c;
}

.language-indicator {
    background: rgba(86, 156, 214, 0.15);
    color: #569cd6;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.step-indicator {
    font-size: 0.9rem;
    font-weight: 500;
    background: rgba(100, 100, 100, 0.2);
    padding: 4px 12px;
    border-radius: 4px;
}

.code-block {
    padding: 0;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 15px;
    line-height: 1.5;
    overflow-x: auto;
    max-height: 400px;
    transition: max-height 0.3s ease;
}

/* 覆盖Shiki的默认样式 */
.code-block :deep(.shiki) {
    padding: 16px 0;
    background-color: transparent !important;
}

.code-block :deep(.line) {
    padding: 2px 16px;
    transition: all 0.3s ease;
}

.code-block :deep(.line:hover) {
    background: rgba(100, 100, 100, 0.1);
}

.code-block :deep(.line-number) {
    display: inline-block;
    width: 40px;
    color: #858585;
    text-align: right;
    padding-right: 16px;
    user-select: none;
}

/* 新增行样式 */
.code-block :deep(.diff.add) {
    background: rgba(46, 160, 67, 0.2);
    position: relative;
    animation: pulseAdded 1.5s ease;
}

.code-block :deep(.diff.add)::before {
    content: '+';
    position: absolute;
    left: 10px;
    color: #3fb950;
    font-weight: bold;
}

/* 删除行样式 */
.code-block :deep(.diff.remove) {
    background: rgba(248, 81, 73, 0.2);
    position: relative;
    animation: pulseRemoved 1.5s ease;
}

.code-block :deep(.diff.remove)::before {
    content: '-';
    position: absolute;
    left: 10px;
    color: #f85149;
    font-weight: bold;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #3c3c3c;
    gap: 12px;
}

.control-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
    background: #3a3a3a;
    border-color: #569cd6;
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.step-slider {
    flex-grow: 1;
    padding: 0 16px;
}

.slider {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: #3c3c3c;
    outline: none;
    transition: background 0.3s ease;
}

.slider:hover {
    background: #569cd6;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #569cd6;
    cursor: pointer;
    transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: #8a66ff;
}

.reset-container {
    text-align: center;
    padding: 12px 16px;
    border-top: 1px solid #3c3c3c;
}

.reset-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    color: #8b949e;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
}

.reset-btn:hover {
    color: #569cd6;
    border-color: #569cd6;
}

@keyframes pulseAdded {
    0% {
        background-color: rgba(46, 160, 67, 0.1);
    }

    50% {
        background-color: rgba(46, 160, 67, 0.3);
    }

    100% {
        background-color: rgba(46, 160, 67, 0.2);
    }
}

@keyframes pulseRemoved {
    0% {
        background-color: rgba(248, 81, 73, 0.1);
    }

    50% {
        background-color: rgba(248, 81, 73, 0.3);
    }

    100% {
        background-color: rgba(248, 81, 73, 0.2);
    }
}

@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        gap: 8px;
    }

    .step-slider {
        width: 100%;
        padding: 0 8px;
    }

    .control-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>