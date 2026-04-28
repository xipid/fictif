// src/client/app.ts

import {
  createApp,
  h,
  shallowRef,
  onMounted,
  type App as VueApp,
  type Component,
  createSSRApp,
} from "vue";
import { usePages } from "./composables/pages.js";

import {
  Router,
  useRouter,
  globalRouter,
} from "./composables/router.js";
import { useHead, globalHead, type HeadManager } from "./composables/head.js";
import { createInertiaHandler } from "./router-factories.js";
import Display from "./components/display.vue";
import Curtain from "./components/curtain.vue";
import type { Page, VisitOptions, PageResult } from "./types.js";
import Head from "./components/head.vue";
import { useCurtain } from "./composables/curtain.js";

interface FictifAppOptions {
  mountTo?: string | HTMLElement;
  resolve?: (name: string) => Promise<Component>;
  setup?: ({ el, App }: { el: Element; App: Component }) => VueApp;
  progress?:
  | false
  | {
    delay?: number;
  };
  initialData?: string | object | undefined;
  copyInitialData?: boolean;
  isSSR?: boolean;
  appName: string;
}

import M from "./components/M.vue";

export const FictifVuePlugin = {
  install(app: VueApp) {
    app.component("Head", Head);
    app.component("M", M);
  },
};

export async function createFictifApp(config?: FictifAppOptions) {
  let {
    mountTo = "#app",
    setup,
    progress = {},
    resolve: providedResolve,
    initialData = undefined,
    copyInitialData = true,
    isSSR = undefined,
    appName = "App",
  } = typeof config == "object" && config ? (config as any) : {};

  let router: Router<VisitOptions>;
  let head: HeadManager;

  if (globalRouter) {
    router = useRouter();
  } else {
    router = useRouter({
      handle: createInertiaHandler(),
    });
  }

  if (globalHead) {
    head = useHead();
  } else {
    head = useHead({
      // maybe some default config

      title: (title) => (title ? title + " | " + appName : appName),
    });

    head.init();
  }

  const resolve = providedResolve || usePages().resolve;

  if (typeof mountTo == "string") {
    const element = document.querySelector<HTMLElement>(mountTo);

    if (!element) {
      throw new Error(
        `[Fictif] Given 'mountTo' query selector didnt resolve to an html element, given: "${mountTo}".`,
      );
    }

    mountTo = element;
  }

  if (!mountTo && typeof setup != "function") {
    // The developer didnt provide us with the mount point and wont mount it manually
    throw new Error(`[Fictif] Didnt receive a root element to mount to.`);
  }

  const renderedPage = shallowRef<Page>({
    component: "",
    props: {},
    path: location.pathname,
    version: "static", // Handled in other places
  });

  router.on(
    "push",
    async ({
      page,
      options: visitOptions,
    }: {
      page: Page;
      options: VisitOptions;
    }) => {
      const component =
        typeof page.component === "string"
          ? await resolve(page.component)
          : page.component;

      // Here, we handle scroll preservation before updating the page
      if (
        typeof visitOptions.preserveScroll == "boolean"
          ? !visitOptions.preserveScroll
          : renderedPage.value.component != component
      ) {
        window.scrollTo(0, 0);
      }

      // Handle partial reloads by merging props
      if (visitOptions.only?.length) {
        const newProps = { ...page.value.props, ...page.props };
        renderedPage.value = { ...page, props: newProps, component };
      } else {
        renderedPage.value = { ...page, component };
      }
    },
  );

  (async function () {
    await router.init();

    // Getting initial data, e.g. the data-page json in #app in inertia apps
    if (copyInitialData && mountTo && mountTo.dataset.page)
      initialData = JSON.parse(mountTo.dataset.page);
    // The dev provided us with data
    else if (typeof initialData == "string")
      initialData = JSON.parse(initialData);

    if (initialData) {
      await router.push(initialData as PageResult);
    } else {
      // Manual router invoc
      await router.visit(location.pathname);
    }
  })();

  // --- CREATE THE ROOT VUE APP ---
  const App = {
    name: "FictifAppRoot",
    setup() {
      onMounted(() => {
        document.body.classList.add("fictif-app-mounted");
      });

      return () => {
        const c = h("div", { id: "fictif-root-wrapper" }, [
          h(Curtain, {}),
          renderedPage.value && typeof renderedPage.value.component == "object"
            ? h(Display, {
              key: renderedPage.value.path,
              // @ts-ignore
              screen: renderedPage.value.component,
              renderKey: `${renderedPage.value.path}-${Date.now()}`,
              ...renderedPage.value.props,
            })
            : undefined,
        ]);

        head.update({ reset: false }); // Ensure default values even if no Head exists

        return c;
      };
    },
  };

  let app: any;

  if (setup) {
    app = setup({ el: mountTo, App, plugin: FictifVuePlugin });
  } else {
    const isSsr =
      typeof isSSR == "boolean"
        ? isSSR
        : mountTo && mountTo.hasAttribute("data-server-rendered");
    app = isSsr ? createSSRApp(App) : createApp(App);
    app.use(FictifVuePlugin);
  }

  if (mountTo) {
    app.mount(mountTo);
  }

  const curtain = useCurtain();
  const initialCloser = curtain.start();

  // --- BIND CORE EVENT LISTENERS ---
  if (progress != false) {
    router.on("navigation", () => {
      let progressTimeout: number | undefined;
      let closer: (() => void) | undefined;
      const finishProgress = () => {
        clearTimeout(progressTimeout);
        initialCloser();
        closer?.();
      };

      progressTimeout = window.setTimeout(
        () => {
          closer = curtain.start();
        },
        (progress as any)?.delay || 300,
      );

      router.once("ready", finishProgress);
    });
  }
}
