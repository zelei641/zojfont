<template>
  <div id="QuestionSubmitDetailsView">
    <a-card v-if="questionSubmit" :title="questionSubmit.userVO.userName">
      <a-descriptions title="判题信息">
        <a-card label="结果">
          <div
            v-if="questionSubmit.judgeInfo.message == 'Accepted'"
            style="color: lawngreen"
          >
            {{ questionSubmit.judgeInfo.message ?? 0 }}
          </div>

          <div
            v-if="questionSubmit.judgeInfo.message == 'Wrong Answer'"
            style="color: red"
          >
            {{ questionSubmit.judgeInfo.message ?? 0 }}
          </div>
        </a-card>
        <a-card label="时间">
          {{ questionSubmit.judgeInfo.time ?? 0 }}ms
        </a-card>
        <a-card label="内存" v-if="questionSubmit.judgeInfo.memory">
          {{
            questionSubmit.judgeInfo.memory == 0
              ? 0
              : questionSubmit.judgeInfo.memory / (1024 * 1024)
          }}MB
        </a-card>

        <a-card label="使用语言">
          {{ questionSubmit.language ?? "java" }}
        </a-card>
        <a-button
          status="success"
          @click="toQuestionPage(questionSubmit.questionId)"
        >
          尝试题目
        </a-button>
      </a-descriptions>
      <a-descriptions title="代码">
        <a-card>
          {{ questionSubmit.code }}
        </a-card>
      </a-descriptions>
      <a-descriptions title="错误信息">
        <a-card label="输入" v-if="questionSubmit.judgeInfo.failInput">
          {{ questionSubmit.judgeInfo.failInput ?? "题目正确" }}
        </a-card>
        <a-card label="输出" v-if="questionSubmit.judgeInfo.failOutput">
          {{ questionSubmit.judgeInfo.failOutput ?? "题目正确" }}
        </a-card>
        <a-card label="正确输出" v-if="questionSubmit.judgeInfo.failRes">
          {{ questionSubmit.judgeInfo.failRes ?? "题目正确" }}
        </a-card>
      </a-descriptions>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
  QuestionVO,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { defineProps, withDefaults } from "vue/dist/vue";
import { number } from "property-information/lib/util/types";

const route = useRoute();

const questionSubmit = ref<QuestionSubmitVO>();

const loadData = async () => {
  console.log(typeof route.query.id);
  const res =
    await QuestionSubmitControllerService.listQuestionSubmitVoUsingGet(
      route.query.id as any
    );
  if (res.code === 0) {
    questionSubmit.value = res.data;
    console.log(questionSubmit.value);
  } else {
    message.error("加载失败，" + res.message);
  }
};

const dataList = ref([]);
const total = ref(0);

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});
const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题目信息",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const router = useRouter();
/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: number) => {
  router.push({
    path: `/view/question/${question}`,
  });
};
/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>
<style scoped>
#QuestionSubmitDetailsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
