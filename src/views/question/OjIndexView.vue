<template>
  <a-col>
    <a-card
      title="Hello ZOJ"
      :bordered="false"
      :style="{ width: '100%', margin: ' 10px' }"
    >
      <template #extra>
        <a-link>编辑帖子</a-link>
      </template>
      <a-button style="margin-right: 10px">刷新推荐</a-button>
      <a-button>关注</a-button>
    </a-card>
  </a-col>

  <div
    :style="{
      boxSizing: 'border-box',
      width: '100%',
      padding: '40px',
      backgroundColor: 'var(--color-fill-2)',
    }"
  >
    <a-row :gutter="20">
      <a-col v-for="item in dataList" :key="item.id">
        <a-card
          :title="item.user.userName"
          :bordered="false"
          :style="{ width: '100%', margin: ' 10px' }"
        >
          <template #extra>
            <a-link>More</a-link>
          </template>
          {{ item.title }}
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PostControllerService, PostQueryRequest } from "../../../../generated";
import message from "@arco-design/web-vue/es/message";

const searchParams = ref<PostQueryRequest>({
  pageSize: 8,
  current: 1,
});

const dataList = ref([]);

const loadData = async () => {
  const res = await PostControllerService.listPostVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    console.log(dataList.value);
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});
</script>

<style scoped></style>
