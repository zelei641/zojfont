<template>
  <div id="userLayout">
    <h1 style="margin: auto">用户登录</h1>
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <img src="../assets/logo.jpg" class="logo" />
        <div>z oj</div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://blog.csdn.net/weixin_64260010?spm=1000.2115.3001.5343">
          zelei
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
  margin-bottom: 16px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>

<script></script>
