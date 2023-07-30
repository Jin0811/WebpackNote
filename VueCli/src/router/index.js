import { createRouter, createWebHistory } from "vue-router";

const Home = () => import(/* webpackChunkName: "Home" */ "../views/home/index");
const About = () => import(/* webpackChunkName: "About" */ "../views/about/index");

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
  ],
});
