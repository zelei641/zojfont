<template>
  <div id="activeManage">
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
      <template #endtime="{ record }">
        {{ moment(record.endtime).format("YYYY-MM-DD") }}
      </template>
      <template #startime="{ record }">
        {{ moment(record.startime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space :size="size">
          <a-button type="primary" @click="addQuestion(record.id)">
            添加题目
          </a-button>
          <a-button type="primary" @click="addUser(record.id)">
            添加用户
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
/**
 * 页面加载时，请求数据
 */
import { onMounted, ref, watchEffect } from "vue";
import {
  ActiveControllerService,
  ActiveQueryRequest,
  ActiveVO,
  Question,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment/moment";
import ActiveAddQuestion from "@/views/active/ActiveAddQuestion.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tableRef = ref();
const prevCurrent = ref(8);
const prevPageSize = ref(1);
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<ActiveQueryRequest>({
  pageSize: 8,
  current: 1,
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const loadData = async () => {
  const res = await ActiveControllerService.getPageVoUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

const onPageChange = (page: number) => {
  console.log(page);
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 跳转到添加题目的页面
 */
const addUser = (activeId: number) => {
  router.push({
    path: `/add/active/user`,
    query: {
      activeId: activeId.toString(),
    },
  });
};

/**
 * 跳转到添加用户的页面
 */
const addQuestion = (activeId: number) => {
  router.push({
    path: `/add/active/question`,
    query: {
      activeId: activeId.toString(),
    },
  });
};

/**
 * 跳转活动详情页面
 * @param question
 */
// const toQuestionPage = (question: Question) => {};

const columns = [
  {
    title: "活动名称",
    dataIndex: "title",
  },
  {
    title: "参与人数",
    dataIndex: "usernum",
  },
  {
    title: "结束时间",
    slotName: "endtime",
  },
  {
    title: "开始时间",
    slotName: "startime",
  },
  {
    slotName: "optional",
  },
];
</script>
<style scoped></style>
