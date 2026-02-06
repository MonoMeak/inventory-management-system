import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Items from "../pages/Items.vue";
import ItemDetail from "../pages/ItemDetail.vue";
import Categories from "../pages/Categories.vue";
import Users from "../pages/Users.vue";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", name: "Login", component: Login },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/products",
      name: "Products",
      component: Items,
      meta: { requiresAuth: true },
    },
    {
      path: "/items",
      name: "Items",
      component: Items,
      meta: { requiresAuth: true },
    },
    {
      path: "/items/:id",
      name: "ItemDetail",
      component: ItemDetail,
      meta: { requiresAuth: true },
    },
    {
      path: "/categories",
      name: "Categories",
      component: Categories,
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "Users",
      component: Users,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // If not authenticated, check for token in localStorage
    if (!auth.isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        auth.token = token;
        auth.isAuthenticated = true;
        try {
          await auth.checkSession();
        } catch (error) {
          // Token is invalid, redirect to login
          localStorage.removeItem("token");
          return "/login";
        }
      } else {
        // No token found, redirect to login
        return "/login";
      }
    }

    // Check if route requires admin access
    if (to.meta.requiresAdmin && !auth.isAdmin) {
      return "/dashboard";
    }
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (to.path === "/login" && auth.isAuthenticated) {
    return "/dashboard";
  }
});

export default router;
