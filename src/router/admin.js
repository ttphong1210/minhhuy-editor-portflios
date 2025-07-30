import LoginComponent from "@/components/admin-page/LoginComponent.vue";
import DashboardComponent from "../components/admin-page/DashboardComponent.vue";

const admin = [
  {
    path: "/admin",
    component: DashboardComponent,
    meta: { requiresAuth: true, title: "Admin Dashboard - Bùi Lê Minh Huy" },
  },
  {
    path: "/login",
    component: LoginComponent,
    meta: { title: "Admin Login - Bùi Lê Minh Huy" },
  },
];

export default admin;
