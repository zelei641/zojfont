import router from "@/router";
import store from "@/store";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

/**
 * 页面权限判断
 */
router.beforeEach(async (to, from, next) => {
  let loginUser = store.state.user.loginUser;
  //todo 自动登录

  //如果之前没登录过 就自动登录
  if (!loginUser || !loginUser.userRole) {
    //加 await 是为了等用户登录成功之后再执行后续的代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }

  console.log(loginUser);

  //获取跳转页面需要的权限
  const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;

  //要跳转的页面必须需要登录
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    //如果没登陆 跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === AccessEnum.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    //如果已经登陆了但是权限不足，那么跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
