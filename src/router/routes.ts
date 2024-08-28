import { RouteRecordRaw } from "vue-router";
import AdminView from "@/views/AdminView.vue";
import NoAuth from "@/views/NoAuth.vue";
import accessEnum from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import QuestionSubmitDetailsView from "@/views/question/QuestionSubmitDetailsView.vue";
import OjIndexView from "@/views/question/OjIndexView.vue";
import UserAddPost from "@/views/post/UserAddPost.vue";
import AddActive from "@/views/active/AddActive.vue";
import ListActive from "@/views/active/ListActive.vue";
import ActiveManage from "@/views/active/ActiveManage.vue";
import ActiveAddQuestion from "@/views/active/ActiveAddQuestion.vue";
import ActiveAddUser from "@/views/active/activeAddUser.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "主页",
    component: OjIndexView,
    meta: {},
  },
  {
    path: "/add/userPost",
    name: "编辑帖子",
    component: UserAddPost,
    meta: {},
  },
  {
    path: "/add/active",
    name: "添加活动",
    component: AddActive,
    meta: {},
  },
  {
    path: "/active/admin",
    name: "管理活动",
    component: ActiveManage,
    meta: {
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/list/active",
    name: "活动列表",
    component: ListActive,
    meta: {},
  },
  {
    path: "/questions",
    name: "题库",
    component: QuestionsView,
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/view/question/:id",
    name: "做题界面",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: accessEnum.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/manage/question/",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/add/active/question",
    name: "活动添加题目",
    component: ActiveAddQuestion,
    meta: {
      hideInMenu: true,
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/add/active/user",
    name: "活动添加用户",
    component: ActiveAddUser,
    meta: {
      hideInMenu: true,
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/admin",
    name: "管理界面",
    component: AdminView,
    meta: {
      access: accessEnum.ADMIN,
    },
  },
  {
    path: "/noauth",
    name: "没有权限",
    component: NoAuth,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
  },
  {
    path: "/question_submit/details",
    name: "浏览题目提交详情",
    component: QuestionSubmitDetailsView,
    meta: {
      hideInMenu: true,
    },
  },
];
