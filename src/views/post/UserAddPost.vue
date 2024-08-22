<template>
  <div id="addQuestionView">
    <h2>发布帖子</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-space direction="vertical" size="large">
          <a-radio-group @change="tagsChange">
            <a-radio value="新鲜事">新鲜事</a-radio>
            <a-radio value="题解">题解</a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>

      <a-form-item field="content" label="帖子内容">
        <MdEditor
          style="width: 100%"
          :value="form.content"
          :handle-change="onContentChange"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { PostAddRequest, PostControllerService } from "../../../../generated";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面

let form = ref<PostAddRequest>({
  title: "",
  tags: [],
  content: "",
});

const doSubmit = async () => {
  console.log(form.value);
  const res = await PostControllerService.addPostUsingPost(form.value);
  if (res.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败，" + res.message);
  }
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

/**
 * 标签改变
 */
const tagsChange = (value: string) => {
  console.log(value);
  var v = [value];
  form.value.tags = v;
};
</script>
<style scoped>
#addQuestionView {
}
</style>
