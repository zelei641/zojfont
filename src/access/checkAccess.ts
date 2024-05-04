/**
 * 检查权限
 * @param loginUser  当前用户
 * @param needAccess 当前页面需要的权限
 * @return boolean 有无权限
 */
import AccessEnum from "@/access/accessEnum";

const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
  //获取当前用户具有的权限(如果没有loginUser表示未登录)
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;

  //如果需要的权限是未登录直接返回true
  if (needAccess === AccessEnum.NOT_LOGIN) return true;

  //需要的权限是普通用户
  if (needAccess === AccessEnum.USER) {
    //如果用户没登录，表示无权限
    if (loginUserAccess === AccessEnum.NOT_LOGIN) {
      return false;
    }
    return true;
  }

  //需要的权限是管理员
  if (needAccess === AccessEnum.ADMIN) {
    if (loginUserAccess !== AccessEnum.ADMIN) {
      return false;
    }
    return true;
  }
};

export default checkAccess;
