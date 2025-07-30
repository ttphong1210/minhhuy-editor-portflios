import PageComponent from "@/components/home-page/PageComponent.vue";
import VideoPageCategory from "@/components/home-page/VideoPageCategory.vue";
import HomePageComponent from "@/components/HomePageComponent.vue";

const home = [
  {
    path: "/",
    component: HomePageComponent,
    meta: { title: "Bùi Lê Minh Huy - Video Editor Portfolio" },
    children: [
      {
        path: "/",
        component: PageComponent,
        meta: { title: "Bùi Lê Minh Huy - Video Editor Portfolio" },
      },
      {
        path: "/videos/:id",
          name: "videos-category",
        component: VideoPageCategory,
        meta: { title: "Bùi Lê Minh Huy - Video Category" }
      }
    ],
  },
];
export default home;
