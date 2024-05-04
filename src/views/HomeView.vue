<template>
  <div id="exampleView">
    <MdEditor :value="mdValue" :handle-change="onMdchange" />
    <code-editor :value="codeValue" :handle-change="onCodechange" />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import HelloWorld from "@/components/ExampleWorld.vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const mdValue = ref();
const codeValue = ref();
const onMdchange = (v: string) => {
  mdValue.value = v;
};

const onCodechange = (v: string) => {
  codeValue.value = v;
};
</script>
