<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 400px; height: 60vh"
  />
  <!--  <a-button @click="fillValue">填充值</a-button>-->
</template>
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "",
  handleChange: (v: string) => {
    console.log("监听到变化" + v);
  },
});
const codeEditorRef = ref();
const codeEditor = ref();
const nextLanguage = ref();

/**
 * 监听属性值的改变
 */
watch(
  () => props.value,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
    console.log(nextLanguage.value + props.language);
    if (
      toRaw(codeEditor.value).getModel().getValue() == "" ||
      nextLanguage.value != props.language
    ) {
      nextLanguage.value = props.language;
      console.log();
      toRaw(codeEditor.value).getModel().setValue(props.value);
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  // 定义monaco的属性
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    colorDecorators: true,
    minimap: {
      enabled: true,
    },
    readOnly: false,
    theme: "vs-dark",
    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });
  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>
<style scoped></style>
