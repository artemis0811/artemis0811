import Vue from 'vue';
import VueRouter from 'vue-router';
import Templates from '../views/Templates.vue';
import Editor from '../views/Editor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/templates',
    component: Templates,
  },
  {
    path: '/editor/create',
    component: Editor,
  },
  {
    path: '/editor/edit/:id',
    component: Editor,
  },
];

const router = new VueRouter({
  routes,
});

export default router