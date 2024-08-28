<template>
  <div id="activeAddQuestion">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum
              ? Math.ceil((record.accpetNum / record.submitNum) * 100)
              : "0"
          }% (${record.accpetNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            type="primary"
            v-if="!activeInfo.questions"
            @click="addActiveQuestion(record.id)"
          >
            添加到活动
          </a-button>
          <a-button
            type="primary"
            v-if="
              activeInfo.questions && !activeInfo.questions.includes(record.id)
            "
            @click="addActiveQuestion(record.id)"
          >
            添加到活动
          </a-button>
          <a-button
            status="warning"
            v-if="
              activeInfo.questions && activeInfo.questions.includes(record.id)
            "
            @click="addActiveQuestion(record.id)"
          >
            移除出活动
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  ActiveControllerService,
  ActiveVO,
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";

const route = useRoute();
const tableRef = ref();
const activeInfo = ref<ActiveVO>();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
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
 * 添加题目到活动
 */
const addActiveQuestion = async (questionId: number) => {
  const res = await ActiveControllerService.addActiveQuestionUsingGet(
    activeInfo.value?.id,
    questionId
  );
  if (res.code === 0) {
    if (res.data) {
      message.success("添加成功");
    }
  } else {
    message.error("加载失败，" + res.message);
  }
  getCurrentActive();
};

/**
 * 得到当前的活动信息
 */
const getCurrentActive = async () => {
  const res = await ActiveControllerService.getByIdUsingGet(
    Number(route.query.activeId)
  );
  if (res.code === 0) {
    activeInfo.value = res.data;
    //message.info("请求成功");
  } else {
    //message.error("加载失败，" + res.message);
  }
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

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  getCurrentActive();
});
</script>

<style scoped>
#activeAddQuestion {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
