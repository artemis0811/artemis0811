import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@editor/views/image-edtor/editor.vue'),
  },
];

export default routes;
