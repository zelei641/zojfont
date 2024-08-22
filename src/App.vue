<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>
<script setup long="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted } from "vue";

const route = useRoute();
const store = useStore();

/*
全局初始化函数,有全局单次调用的代码，都可以写到这里
 */
const doInIt = () => {
  console.log("hello");
};

//使用钩子函数调用
onMounted(() => {
  doInIt();
});
</script>
