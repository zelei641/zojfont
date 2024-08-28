<template>
  <div id="addActiveView">
    <h2>添加活动</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="活动标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="活动类型">
        <a-space direction="vertical" size="large">
          <a-radio-group @change="tagsChange">
            <a-radio value="比赛">比赛</a-radio>
            <a-radio value="活动">活动</a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>

      <a-form-item field="content" label="活动详情">
        <MdEditor
          style="width: 100%"
          :value="form.content"
          :handle-change="onContentChange"
        />
      </a-form-item>

      <a-form-item field="startime" label="活动开始时间">
        <a-range-picker
          style="width: 360px; margin: 0 24px 24px 0"
          show-time
          :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
          format="YYYY-MM-DD HH:mm"
          @change="onChange"
          @select="onSelect"
          @ok="onOk"
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
import {
  ActiveAddRequest,
  ActiveControllerService,
  PostAddRequest,
  PostControllerService,
} from "../../../../generated";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面

let form = ref<ActiveAddRequest>({
  title: "",
  iscom: 1,
  content: "",
  startime: "",
  endtime: "",
});

const doSubmit = async () => {
  console.log(form.value);
  const res = await ActiveControllerService.addActiveUsingPost(form.value);
  if (res.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败，" + res.message);
  }
};

/**
 * 时间发生改变
 * @param value
 */
const onChange = (dateString: string, date: string) => {
  console.log(dateString, date);
};
/**
 * 时间选择后
 * @param value
 */
const onSelect = (dateString: string, date: string) => {
  console.log(dateString, date);
};
/**
 * 时间确认后
 * @param value
 */
const onOk = (dateString: string, date: string) => {
  (form.value.startime = dateString[0]),
    (form.value.endtime = dateString[1]),
    console.log(dateString);
};
const onContentChange = (value: string) => {
  form.value.content = value;
};
</script>
<style scoped></style>
