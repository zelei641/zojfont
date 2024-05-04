// initial state
// shape: [{ id, quantity }]
import { StoreOptions } from "vuex";
import AccessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../../generated";

// getters
// actions 执行更新操作
// mutations 定义了跟新变量的方法 尽量同步

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      //todo 改为从远程获取登录信息
      userName: "未登录",
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      //从远程请求获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRoles: AccessEnum.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
      console.log(state.loginUser);
    },
  },
} as StoreOptions<any>;
