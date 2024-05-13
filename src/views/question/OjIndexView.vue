<template>
  <div
    :style="{
      boxSizing: 'border-box',
      width: '100%',
      padding: '40px',
      backgroundColor: 'var(--color-fill-2)',
    }"
  >
    <a-row :gutter="20">
      <a-col>
        <a-card
          title="Arco Card"
          :bordered="false"
          :style="{ width: '100%', margin: ' 10px' }"
        >
          <template #extra>
            <a-link>More</a-link>
          </template>
          Card content
        </a-card>
      </a-col>
      <a-col>
        <a-card
          title="Arco Card"
          :bordered="false"
          :style="{ width: '100%', margin: ' 10px' }"
        >
          <template #extra>
            <a-link>More</a-link>
          </template>
          Card content
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
