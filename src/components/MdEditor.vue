<template>
  <Editor
    :value="value"
    :mode="mode"
    :plugins="plugins"
    :locale="zhHans"
    :uploadImages="uploadImage"
    @change="handleChange"
  />
  <Viewer id="markdown-body" :value="articleHtmlContent" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import breaks from "@bytemd/plugin-breaks";
import gemoji from "@bytemd/plugin-gemoji";
import math from "@bytemd/plugin-math-ssr";
import medium from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import frontmatter from "@bytemd/plugin-frontmatter";
import zhHans from "bytemd/lib/locales/zh_Hans.json";
import { ref, withDefaults, defineProps } from "vue";
import {
  FileControllerService,
  QuestionQueryRequest,
} from "../../../generated";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  mode: string;
  handleChange: (v: string) => void;
}

const plugins = [
  breaks(),
  gemoji(),
  math(),
  medium(),
  mermaid(),
  frontmatter(),
  gfm(),
  highlight(),
  // Add more plugins here
];

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});

// 上传图片 点击触发上传图片事件，大家获取文件把图片上传服务器然后返回url既可
const uploadImage = async (files: File) => {
  console.log("files", files);
  const res = await FileControllerService.uploadPphotoUsingPost(
    files,
    "post_photo"
  );
  let url = res.data;
  console.log(url);
  return [
    {
      title: files.map((i) => i.name),
      url: url,
    },
  ];
};
</script>
<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
