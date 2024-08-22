<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question" @change="getUserSumbit">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap v-if="showTags">
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
                <a-switch @change="changeShowTags" />
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled>评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案"></a-tab-pane>
          <a-tab-pane key="sumbit" title="提交记录">
            <a-table
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
              <template #judgeInfo="{ record }">
                <a-button
                  color="green"
                  :default-checked="true"
                  v-if="record.judgeInfo.message == 'Accepted'"
                  status="success"
                  @click="toQuestionPageDetails(record.id)"
                >
                  {{ record.judgeInfo.message }}
                </a-button>
                <a-button
                  color="red"
                  :default-checked="true"
                  v-if="record.judgeInfo.message == 'Wrong Answer'"
                  status="warning"
                  @click="toQuestionPageDetails(record.id)"
                >
                  {{ record.judgeInfo.message }}
                </a-button>
                <a-button
                  color="red"
                  :default-checked="true"
                  v-if="
                    record.judgeInfo.message !== 'Wrong Answer' &&
                    record.judgeInfo.message !== 'Accepted'
                  "
                  status="warning"
                  @click="toQuestionPageDetails(record.id)"
                >
                  {{ record.judgeInfo.message }}
                </a-button>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-row class="grid-demo" justify="space-between">
          <a-col span="14">
            <a-form :model="form" layout="inline">
              <a-form-item
                field="language"
                label="编程语言"
                style="min-width: 240px"
              >
                <a-select
                  v-model="form.language"
                  :style="{ width: '320px' }"
                  placeholder="选择编程语言"
                  @change="onchangeLanguage"
                >
                  <a-option>cpp</a-option>
                  <a-option>java</a-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col span="6" v-if="currentSumbitMessage">
            <a-button
              color="green"
              :default-checked="true"
              v-if="currentSumbitMessage?.judgeInfo.message == 'Accepted'"
              status="success"
              @click="toQuestionPageDetails(currentSumbitMessage?.id)"
            >
              {{ currentSumbitMessage?.judgeInfo.message }}
            </a-button>
            <a-button
              color="red"
              :default-checked="true"
              v-if="currentSumbitMessage?.judgeInfo.message == 'Wrong Answer'"
              status="warning"
              @click="toQuestionPageDetails(currentSumbitMessage?.id)"
            >
              {{ currentSumbitMessage?.judgeInfo.message }}
            </a-button>
            <a-button
              color="red"
              :default-checked="true"
              v-if="
                currentSumbitMessage?.judgeInfo.message !== 'Wrong Answer' &&
                currentSumbitMessage?.judgeInfo.message !== 'Accepted'
              "
              status="warning"
              @click="toQuestionPageDetails(currentSumbitMessage?.id)"
            >
              {{ currentSumbitMessage?.judgeInfo.message }}
            </a-button>
          </a-col>
          <a-col span="2">
            <a-button type="primary" @click="getCurrentSumbit()">
              刷新
            </a-button>
          </a-col>
        </a-row>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-divider size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit">
          提交代码
        </a-button>
        <a-button
          type="primary"
          style="min-width: 200px; margin-left: 10px"
          @click="doUserSave"
        >
          保存代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
  QuestionVO,
  UserSaveControllerService,
} from "../../../../generated";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const dataList = ref([]);
const currentSumbitMessage = ref();
const total = ref(0);
const store = useStore();
const loginUser = store.state.user.loginUser;

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => -1,
});

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: props.id,
  userId: loginUser.id,
  pageSize: 10,
  current: 1,
});
const currentSumbitParams = ref<QuestionSubmitQueryRequest>({
  questionId: props.id,
  userId: loginUser.id,
  pageSize: 1,
  current: 1,
});
const question = ref<QuestionVO>();
const showTags = ref<boolean>(false);
const router = useRouter();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
  onchangeLanguage();
  getCurrentSumbit();
};

const getUserSumbit = async (key: any) => {
  console.log(key);
  if (key === "sumbit") {
    console.log(loginUser.id);
    const res =
      await QuestionSubmitControllerService.listQuestionSubmitVoByPageUsingPost(
        searchParams.value
      );
    if (res.code === 0) {
      dataList.value = res.data.records;
      total.value = res.data.total;
      console.log(dataList.value);
    } else {
      message.error("加载失败，" + res.message);
    }
  }
};

/**
 * 获取最新的提交记录
 */
const getCurrentSumbit = async () => {
  console.log(loginUser.id);
  const res =
    await QuestionSubmitControllerService.listQuestionSubmitVoByPageUsingPost(
      currentSumbitParams.value
    );
  if (res.code === 0) {
    currentSumbitMessage.value = res.data.records[0];
    console.log(currentSumbitMessage);
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "cpp",
  code: "",
});

const changeShowTags = () => {
  showTags.value = showTags.value ? false : true;
  console.log(showTags);
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 保存代码
 */
const doUserSave = async () => {
  if (!question.value?.id) {
    return;
  }
  var code = form.value.code;
  var langauge = form.value.language;
  const res = await UserSaveControllerService.updateUserSaveCodeUsingPost({
    code: code,
    questionId: question.value.id,
    langauge: langauge,
  });
  if (res.code === 0) {
    message.success(res.message);
  } else {
    message.error("保存失败," + res.message);
  }
};

//编程语言改变后
const onchangeLanguage = async () => {
  console.log(form.value.language);
  const res = await UserSaveControllerService.getUserSaveCodeUsingPost({
    langauge: form.value.language,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("请求成功");
    form.value.code = res.data;
    console.log(form.value.code);
  } else {
    message.error("提交失败," + res.message);
  }
};

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

const onPageChange = async (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  const res =
    await QuestionSubmitControllerService.listQuestionSubmitVoByPageUsingPost(
      searchParams.value
    );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
    console.log(dataList.value);
  } else {
    message.error("加载失败，" + res.message);
  }
};
/**
 * 跳转到提交详情页面
 * @param question
 */
const toQuestionPageDetails = (id: number) => {
  router.push({
    path: "/question_submit/details",
    query: {
      id: id,
    },
  });
};
const changeCode = (value: string) => {
  form.value.code = value;
};
const columns = [
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "题目id",
    dataIndex: "questionId",
  },
];
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
