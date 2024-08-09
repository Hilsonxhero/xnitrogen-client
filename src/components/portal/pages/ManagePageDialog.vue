<template>
    <div>
        <v-dialog
            :retain-focus="false"
            :eager="true"
            persistent
            :close-on-back="false"
            z-index="1100"
            v-model="visible"
            transition="dialog-bottom-transition"
            fullscreen
        >
            <v-card>
                <v-toolbar>
                    <v-btn icon="mdi-close" @click="handleClose"></v-btn>

                    <v-toolbar-title>Settings</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-toolbar-items>
                        <v-btn text="Save" variant="text" @click="handleClose"></v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <div>
                    <editor :init="init"></editor>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import tinymce from 'tinymce/tinymce.js';
const editorValue = ref('');

import 'tinymce/themes/silver'; // 编辑器主题，不引入则报错
import 'tinymce/icons/default'; // 引入编辑器图标icon，不引入则不显示对应图标
// import 'tinymce/skins/ui/oxide/content.css';
// import 'tinymce/skins/content/default/content.css';
// // 引入编辑器插件（基本免费插件都在这儿了）
import 'tinymce/plugins/advlist'; // 高级列表
import 'tinymce/plugins/anchor'; // 锚点
import 'tinymce/plugins/autolink'; // 自动链接
import 'tinymce/plugins/autoresize'; // 编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave'; // 自动存稿
import 'tinymce/plugins/charmap'; // 特殊字符
import 'tinymce/plugins/code'; // 编辑源码
import 'tinymce/plugins/codesample'; // 代码示例
import 'tinymce/plugins/directionality'; // 文字方向
import 'tinymce/plugins/emoticons'; // 表情

import 'tinymce/plugins/fullpage'; // 文档属性
import 'tinymce/plugins/fullscreen'; // 全屏
import 'tinymce/plugins/help'; // 帮助
import 'tinymce/plugins/hr'; // 水平分割线
import 'tinymce/plugins/image'; // 插入编辑图片
import 'tinymce/plugins/importcss'; // 引入css
import 'tinymce/plugins/insertdatetime'; // 插入日期时间
import 'tinymce/plugins/link'; // 超链接
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/media'; // 插入编辑媒体
import 'tinymce/plugins/nonbreaking'; // 插入不间断空格
import 'tinymce/plugins/pagebreak'; // 插入分页符
import 'tinymce/plugins/paste'; // 粘贴插件
import 'tinymce/plugins/preview'; // 预览
// import 'tinymce/plugins/print'// 打印
import 'tinymce/plugins/quickbars'; // 快速工具栏
import 'tinymce/plugins/save'; // 保存
import 'tinymce/plugins/searchreplace'; // 查找替换
// import 'tinymce/plugins/spellchecker'  //拼写检查，暂未加入汉化，不建议使用
import 'tinymce/plugins/tabfocus'; // 切入切出，按tab键切出编辑器，切入页面其他输入框中
import 'tinymce/plugins/table'; // 表格
// import 'tinymce/plugins/template' // 内容模板
import 'tinymce/plugins/textcolor'; // 文字颜色
import 'tinymce/plugins/textpattern'; // 快速排版
import 'tinymce/plugins/toc'; // 目录生成器
import 'tinymce/plugins/visualblocks'; // 显示元素范围
import 'tinymce/plugins/visualchars'; // 显示不可见字符
import 'tinymce/plugins/wordcount'; // 字数统计

// 語言包
// import 'tinymce-i18n/langs5/fa_IR.js';
import 'tinymce-i18n/langs/fa_IR';

import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const init = reactive({
    cleanup: true,
    language: 'fa_IR',

    skin_url: '/tinymce/skins/ui/oxide',

    plugins:
        'emoticons preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media code codesample table charmap  hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave ', // 插件配置
    toolbar:
        'emoticons  undo redo  forecolor backcolor bold italic underline strikethrough link  \ table image | alignleft aligncenter alignright alignjustify outdent indent | \  formatselect  fontsizeselect | bullist numlist | blockquote   removeformat | media   hr pagebreak  print preview | code selectall  | indent2em lineheight formatpainter axupimgs',

    emoticons_database_url: '/tinymce/emoticons/js/emojis.js',
    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',
    font_formats:
        '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
    lineheight_formats: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5',
    branding: false,
    resize: false,

    elementpath: false,

    content_css: '/tinymce/index.css',

    paste_data_images: true,
    images_upload_handler: (blobInfo, success, failure) => {}
});

const editorRef = ref(null);
const visible_snackbar = ref(false);
const snackbar_text = ref(null);

const emits = defineEmits(['update:modelValue', 'create']);
const visible = ref(false);

const form = ref({
    title: null
});

const route = useRoute();

const loader = ref(false);

const handleSubmit = async () => {
    try {
        loader.value = true;
        const formData = {
            project_id: route.params.id,
            title: form.value.title,
            name: form.value.title,
            landing_page_id: route.params.item
        };
        const { data } = await ApiService.post(`application/portal/projects/${route.params.id}/page/menu/categories`, formData);

        if (data.success) {
            emits('create', true);
            form.value.title = null;
            snackbar_text.value = 'عملیات  با موفقیت انجام شد';
            visible_snackbar.value = true;
            handleClose();
        }

        loader.value = false;
    } catch (error) {
        loader.value = false;
    }
};

const handleClose = () => {
    emits('update:modelValue', false);
};

watch(
    () => props.modelValue,
    (val: boolean) => {
        visible.value = val;
    },
    { immediate: true }
);
watch(
    () => visible.value,
    (val: boolean) => {}
);

onMounted(() => {});
</script>
