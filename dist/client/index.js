import { reactive as U, defineComponent as I, useAttrs as Pe, shallowRef as Q, watch as j, openBlock as g, createBlock as L, KeepAlive as qe, resolveDynamicComponent as q, normalizeProps as Ve, guardReactiveProps as We, unref as oe, withCtx as se, mergeProps as fe, computed as A, createElementBlock as x, createStaticVNode as ze, createElementVNode as S, toDisplayString as V, createCommentVNode as P, ref as k, onMounted as z, nextTick as X, onUnmounted as ye, Transition as De, normalizeClass as ae, Fragment as G, useSlots as Oe, watchEffect as Ge, Comment as Je, Text as ke, h as Y, createSSRApp as Xe, createApp as Qe, toRefs as Ye, withModifiers as Ze, withDirectives as et, vModelText as tt, renderList as le, markRaw as xe, normalizeStyle as st, createVNode as _e, renderSlot as Re, TransitionGroup as Le } from "vue";
import { nameToId as Ee, pages as Te } from "virtual:fictif-pages-data";
import nt from "markdown-it";
import de from "markdown-it-mathjax3";
let he = null;
function rt() {
  function a(r) {
    return Ee[r] || r;
  }
  async function e(r) {
    if (typeof r == "object") return r;
    r = r.replaceAll("/", ".");
    const n = a(r), o = Te[n];
    if (!o)
      throw console.error(`[Fictif] Page not found: "${r}" with id: "${n}".`), new Error(`Page not found: ${r}`);
    return (await o()).default;
  }
  function t(r) {
    return r = r.replaceAll("/", "."), a(r) in Te;
  }
  function s() {
    return Object.keys(Ee);
  }
  return { resolve: e, has: t, list: s };
}
function ot() {
  return he || (he = rt()), he;
}
class W {
  _listeners;
  static _defaultMaxListeners = 10;
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /**
   * Registers an event listener to be called when the event is emitted.
   * @param event The name of the event to listen for.
   * @param listener The callback function.
   * @returns The emitter instance for chaining.
   */
  on(e, t) {
    const s = this._listeners.get(e);
    return s ? s.push(t) : this._listeners.set(e, [t]), this.checkMaxListeners(e), this;
  }
  /**
   * Adds a one-time listener for the event. This listener is invoked only the next
   * time the event is emitted, after which it is removed.
   * @param event The name of the event to listen for.
   * @param listener The callback function.
   * @returns The emitter instance for chaining.
   */
  once(e, t) {
    const s = (...r) => {
      this.off(e, s), t(...r);
    };
    return s.listener = t, this.on(e, s), this;
  }
  /**
   * Removes a specific listener for a given event.
   * @param event The name of the event.
   * @param listener The listener function to remove.
   * @returns The emitter instance for chaining.
   */
  off(e, t) {
    const s = this._listeners.get(e);
    if (s) {
      const r = s.filter((n) => n !== t && n.listener !== t);
      r.length ? this._listeners.set(e, r) : this._listeners.delete(e);
    }
    return this;
  }
  /**
   * Synchronously calls each of the listeners registered for the event, in the order
   * they were registered, passing the supplied arguments to each.
   *
   * @param event The name of the event to emit.
   * @param args The arguments to pass to the listeners.
   * @returns A promise that resolves with an array of all non-undefined values
   * returned by the listeners.
   */
  async emit(e, ...t) {
    const s = this._listeners.get(e);
    if (!s || s.length === 0) {
      if (e === "error")
        throw t[0] instanceof Error ? t[0] : new Error("Unhandled error event");
      return [];
    }
    const n = [...s].map((i) => i(...t));
    return (await Promise.all(n)).filter((i) => i !== void 0);
  }
  /**
   * Adds the listener function to the beginning of the listeners array for the specified event.
   * @param event The name of the event.
   * @param listener The listener function.
   * @returns The emitter instance for chaining.
   */
  prependListener(e, t) {
    const s = this._listeners.get(e);
    return s ? s.unshift(t) : this._listeners.set(e, [t]), this.checkMaxListeners(e), this;
  }
  /**
   * Adds a one-time listener function for the event to the beginning of the listeners array.
   * @param event The name of the event.
   * @param listener The listener function.
   * @returns The emitter instance for chaining.
   */
  prependOnceListener(e, t) {
    const s = (...r) => {
      this.off(e, s), t(...r);
    };
    return s.listener = t, this.prependListener(e, s), this;
  }
  /**
   * Removes all listeners for a specific event, or all listeners from all events
   * if no event is specified.
   * @param event The optional event name.
   * @returns The emitter instance for chaining.
   */
  removeAllListeners(e) {
    return e ? this._listeners.delete(e) : this._listeners.clear(), this;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   */
  eventNames() {
    return Array.from(this._listeners.keys());
  }
  /**
   * Returns a copy of the array of listeners for the specified event.
   * @param event The name of the event.
   */
  listeners(e) {
    return [...this._listeners.get(e) || []];
  }
  /**
   * Returns the number of listeners listening to the specified event.
   * @param event The name of the event.
   */
  listenerCount(e) {
    return this._listeners.get(e)?.length || 0;
  }
  /**
   * By default, a warning is printed if more than 10 listeners are added for
   * a particular event. This is a useful default that helps in finding memory leaks.
   * @param n The new maximum.
   */
  setMaxListeners(e) {
    return W._defaultMaxListeners = e, this;
  }
  /**
   * Returns the current max listener value for the emitter.
   */
  getMaxListeners() {
    return W._defaultMaxListeners;
  }
  checkMaxListeners(e) {
    const t = this.listenerCount(e), s = this.getMaxListeners();
    s > 0 && t > s && console.warn(`[Fictif EventEmitter] Possible memory leak detected. ${t} '${String(e)}' listeners added. Use setMaxListeners() to increase limit.`);
  }
}
function ts() {
  return new W();
}
class it {
  constructor(e) {
    this.route = e;
  }
  name(e) {
    return this.route.name = e, this;
  }
  middleware(e) {
    if (typeof e == "string")
      this.route.middleware.push(e);
    else if (Array.isArray(e))
      this.route.middleware.push(...e);
    else if (typeof e == "object") {
      const t = this.route.method, s = e[t] || e.all;
      s && this.route.middleware.push(
        ...Array.isArray(s) ? s : [s]
      );
    }
    return this;
  }
  where(e, t) {
    return this.route.constraints[e] = t.startsWith("^") ? t : `^${t}$`, this;
  }
}
class ve extends W {
  _routes;
  _middlewares;
  _fallbackHandler;
  _prefix = "";
  _namePrefix = "";
  _domain = "";
  _middlewareStack = [];
  _parent;
  constructor(e = null) {
    super(), this._parent = e, e ? (this._routes = e._routes, this._middlewares = e._middlewares, this._fallbackHandler = e._fallbackHandler) : (this._routes = [], this._middlewares = {}, this._fallbackHandler = null);
  }
  group(e) {
    const t = new ve(this);
    e(t);
  }
  prefix(e) {
    return this._prefix = e.replace(/\/$/, ""), this;
  }
  name(e) {
    return this._namePrefix = e.endsWith(".") ? e : e + ".", this;
  }
  domain(e) {
    return this._domain = e, this;
  }
  applyMiddleware(...e) {
    return this._middlewareStack.push(...e), this;
  }
  get(e, t) {
    return this._addRoute("get", e, t);
  }
  post(e, t) {
    return this._addRoute("post", e, t);
  }
  put(e, t) {
    return this._addRoute("put", e, t);
  }
  delete(e, t) {
    return this._addRoute("delete", e, t);
  }
  patch(e, t) {
    return this._addRoute("patch", e, t);
  }
  all(e, t) {
    return this._addRoute("all", e, t);
  }
  any(e, t) {
    return this.all(e, t);
  }
  view(e, t) {
    return this.get(e, t);
  }
  redirect(e, t, s = 302) {
    return this.all(e, () => ({ redirect: { to: t, status: s } }));
  }
  fallback(e) {
    const t = this._addRoute("all", ".*", e);
    return t.route.isFallback = !0, this._fallbackHandler = t.route, t;
  }
  _addResourceRoutes(e, t, s) {
    const r = e.replace(/^\//, ""), n = s ? ["index", "store", "show", "update", "destroy"] : ["index", "create", "store", "show", "edit", "update", "destroy"];
    n.includes("index") && t.index && this.get(`/${r}`, t.index).name(
      `${r}.index`
    ), n.includes("create") && t.create && this.get(`/${r}/create`, t.create).name(
      `${r}.create`
    ), n.includes("store") && t.store && this.post(`/${r}`, t.store).name(
      `${r}.store`
    ), n.includes("show") && t.show && this.get(`/${r}/:id`, t.show).name(
      `${r}.show`
    ), n.includes("edit") && t.edit && this.get(`/${r}/:id/edit`, t.edit).name(
      `${r}.edit`
    ), n.includes("update") && t.update && (this.put(`/${r}/:id`, t.update).name(
      `${r}.update`
    ), this.patch(`/${r}/:id`, t.update)), n.includes("destroy") && t.destroy && this.delete(`/${r}/:id`, t.destroy).name(
      `${r}.destroy`
    );
  }
  resource(e, t) {
    this._addResourceRoutes(e, t, !1);
  }
  apiResource(e, t) {
    this._addResourceRoutes(e, t, !0);
  }
  _buildPattern(e, t) {
    const s = "^" + e.replace(/(\/?)\*/g, "($1.*)?").replace(/(?:::|:)(\w+)(\?)?/g, (r, n, o) => (t.push(n), r.startsWith("::") ? "(.*)" : o ? "(?:/([^/]+))?" : "([^/]+)")) + (this.getOptions().strict ? "" : "/?$");
    return new RegExp(s, this.getOptions().caseSensitive ? "" : "i");
  }
  _addRoute(e, t, s) {
    const r = this._prefix + (t.startsWith("/") || t === "" ? t : "/" + t), n = [], o = [], i = this._domain || (this._parent?._domain ?? ""), l = {
      method: e.toLowerCase(),
      pattern: this._buildPattern(r, n),
      domainPattern: i ? this._buildPattern(i.replace(/\./g, "\\."), o) : void 0,
      paramNames: n,
      domainParamNames: o,
      handler: s,
      originalPath: r,
      middleware: [...this._middlewareStack],
      name: this._namePrefix,
      constraints: {},
      isFallback: !1,
      isScopedMiddleware: !1
    };
    this._routes.push(l);
    const c = new it(l);
    return this._namePrefix && (c.route.name = this._namePrefix + (c.route.name || "")), c;
  }
  getOptions() {
    return this._parent ? this._parent.getOptions() : {};
  }
}
class at extends ve {
  _options;
  _current = null;
  _globalMiddleware = [];
  _lookupCache = /* @__PURE__ */ new Map();
  constructor(e = {}) {
    super(null), this._options = { caseSensitive: !1, strict: !1, ...e }, e.handle && (Array.isArray(e.handle) ? e.handle : [e.handle]).forEach((s) => this.use(s));
  }
  getOptions() {
    return this._options;
  }
  current() {
    return this._current;
  }
  middleware(e, t) {
    return this._middlewares[e] = t, this;
  }
  use(e, t) {
    if (typeof e == "function")
      this._globalMiddleware.push(e);
    else if (t) {
      const s = this._addRoute(
        "all",
        e.replace(/\/$/, "") + "/(.*)",
        () => {
        }
      );
      s.route.isScopedMiddleware = !0;
      const r = t.name || `scoped_${this._routes.length}`;
      this.middleware(r, t), s.middleware(r);
    }
    return this;
  }
  route(e, t = {}) {
    const s = this._routes.find((o) => o.name === e);
    if (!s)
      throw new Error(`[RouteMap] Route with name "${e}" not found.`);
    let r = s.originalPath;
    const n = { ...t };
    return [...s.paramNames, ...s.domainParamNames].forEach((o) => {
      if (n[o] === void 0 && !s.originalPath.includes(`:${o}?`))
        throw new Error(
          `[RouteMap] Missing required parameter "${o}" for route "${e}".`
        );
      n[o] !== void 0 && (r = r.replace(`::${o}`, String(n[o])).replace(`:${o}?`, String(n[o])).replace(`:${o}`, String(n[o])));
    }), r.replace(/\/:\w+\?/g, "");
  }
  clearCache() {
    this._lookupCache.clear();
  }
  _findMatch(e) {
    const t = (e.method || "get").toLowerCase();
    let s = e.path || "/";
    !this._options.strict && s.length > 1 && (s = s.replace(/\/$/, ""));
    const r = e.hostname || "", n = `${t}::${r}::${s}`;
    if (this._lookupCache.has(n))
      return this._lookupCache.get(n);
    const o = this._routes.filter(
      (i) => !i.isFallback && !i.isScopedMiddleware && (i.method === t || i.method === "all")
    );
    for (const i of o) {
      const l = i.domainPattern ? r.match(i.domainPattern) : !0;
      if (!l) continue;
      const c = s.match(i.pattern);
      if (c) {
        const u = l && Array.isArray(l) ? i.domainParamNames.reduce(
          (b, R, p) => ({ ...b, [R]: l[p + 1] }),
          {}
        ) : {}, f = i.paramNames.reduce(
          (b, R, p) => ({ ...b, [R]: c[p + 1] }),
          {}
        ), d = { ...u, ...f };
        let h = !0;
        for (const b in i.constraints)
          if (d[b] && !new RegExp(i.constraints[b]).test(d[b])) {
            h = !1;
            break;
          }
        if (!h) continue;
        const w = {
          route: i,
          params: d,
          args: c.slice(1).map((b) => b || "")
        };
        return this._lookupCache.set(n, w), w;
      }
    }
    return this._lookupCache.set(n, null), null;
  }
  async dispatch(e) {
    this.emit("beforeDispatch", e), this._current = null;
    const t = async (l) => {
      const c = this._findMatch(l);
      if (!c && !this._fallbackHandler)
        return;
      const u = c ? c.route : this._fallbackHandler, f = c ? c.args : [], d = c ? c.params : {};
      this._current = {
        route: u,
        params: d,
        args: f
      }, l.params = d;
      const h = [], w = /* @__PURE__ */ new Set(), b = (p) => {
        const m = this._middlewares[p];
        m && !w.has(m) && (w.add(m), h.push(m));
      };
      u.middleware.forEach(b);
      const R = (p) => p < h.length ? h[p](l, () => R(p + 1)) : u.handler(l, ...f);
      return R(0);
    }, s = [], r = /* @__PURE__ */ new Set(), n = (l) => {
      l && !r.has(l) && (r.add(l), s.push(l));
    };
    this._globalMiddleware.forEach(n), this._routes.filter((l) => l.isScopedMiddleware && (e.path || "/").match(l.pattern)).forEach((l) => {
      l.middleware.forEach((c) => n(this._middlewares[c]));
    });
    const o = (l) => l < s.length ? s[l](e, () => o(l + 1)) : t(e), i = await o(0);
    return this.emit("afterDispatch", { req: e, result: i }), i;
  }
}
class ce {
  // Internally, the result can have a flexible PATH.
  result = {
    // By default, the PATH is undefined, signaling the router to use the request path.
    path: void 0
  };
  component(e) {
    return this.result.component = e, this;
  }
  with(e) {
    return this.result.props = { ...this.result.props || {}, ...e }, this;
  }
  asPath(e) {
    return this.result.path = e, this;
  }
  message(e) {
    return this.with({
      flash: { ...this.result.props?.flash || {}, message: e }
    });
  }
  error(e) {
    return this.with({
      flash: { ...this.result.props?.flash || {}, error: e }
    });
  }
  build() {
    return this.result;
  }
}
function ss() {
  return new ce();
}
function ns(a) {
  return new ce().component(a.replace(/\//g, "."));
}
function rs() {
  const a = new ce();
  return a.result.component = !1, a.result.path = "==back==", a;
}
function os(a) {
  const e = new ce();
  return e.result.redirect = a, e;
}
let B = null, Me = null;
function lt(a, e) {
  if (a.hasAttribute("data-intercept-link")) return !0;
  let t = !1;
  return e && (t = e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey), !(t || a.hasAttribute("target") || a.hasAttribute("download") || a.origin !== window.location.origin);
}
class ne extends at {
  state;
  options;
  navigationPrevented = !1;
  navigating = !1;
  constructor(e = {}) {
    super({
      handle: e?.handle
    }), this.options = e || {}, this.state = U({
      props: {},
      path: typeof window < "u" ? window.location.pathname : "/",
      component: null,
      version: null
    }), B || this.init();
  }
  get result() {
    return this.state;
  }
  get path() {
    return this.state.path;
  }
  _popState = (e) => {
    e.state?.fictif && this.visit(e.state.path);
  };
  _interceptLink = (e) => {
    const t = e.target.closest("a");
    if (!t) return;
    const s = (t.getAttribute("method") || "get").toLowerCase();
    lt(t, e) && (e.preventDefault(), this.visit(t.getAttribute("href") || "/", {
      only: t.dataset.only?.split(","),
      preserveScroll: t.hasAttribute("data-preserve-scroll"),
      method: s
    }));
  };
  uninit() {
    typeof window < "u" && typeof document < "u" && (window.removeEventListener("popstate", this._popState), document.removeEventListener("click", this._interceptLink, {
      capture: !0
    }));
  }
  init() {
    B && B.uninit(), B = this, typeof window < "u" && typeof document < "u" && (window.addEventListener("popstate", this._popState), document.addEventListener("click", this._interceptLink, {
      capture: !0
    }), Me = this);
  }
  preventNavigation() {
    this.navigationPrevented = !0;
  }
  async visit(e, t = {}) {
    if (!this.navigating) {
      if (this.navigationPrevented = !1, await this.emit("leaving", { options: t, path: e }), this.navigationPrevented) return;
      await this.emit("navigation", { options: t, path: e }), this.navigating = !0;
    }
    this.emit("step", { path: e, options: t });
    try {
      let s = await this.resolve(e, t);
      if (typeof s == "object" && s && typeof s.build == "function" && (s = s.build()), !s) {
        await this.emit("error", {
          path: e,
          error: new Error("No route handler returned a result.")
        });
        return;
      }
      if (s.redirect) {
        await this.visit(s.redirect, { replace: !0 });
        return;
      }
      let r;
      s.path === "==back==" ? r = this.state.path : s.path ? r = s.path : r = e;
      const n = {
        ...s,
        path: r
      };
      this.navigating = !1, await this.emit("navigated", { page: n }), await this.push(n, t);
    } catch (s) {
      await this.emit("error", { path: e, error: s }), await this.emit("ready"), console.error(
        `[Fictif Router] Failed to resolve route "${e}":`,
        s
      );
    }
  }
  async push(e, t = {}) {
    const s = { ...this.state.props, ...e.props }, r = e.component === !1 ? this.state.component : e.component;
    this.state.component = r, this.state.props = s, this.state.path = e.path, e.version && (this.state.version = e.version);
    const n = t.replace ? "replaceState" : "pushState";
    Me === this && window.history[n](
      { fictif: !0, path: e.path },
      "",
      e.path
    ), await this.emit("push", { page: this.state, options: t }), await this.emit("ready");
  }
  async resolve(e, t = {}) {
    const s = {
      ...t,
      path: e,
      method: t.method || "GET",
      old: this.result
    };
    return this.dispatch(s);
  }
}
function pe(a) {
  return a instanceof ne ? a : Array.isArray(a) || typeof a == "function" ? new ne({
    handle: a
  }) : a ? new ne(a) : B || new ne();
}
let N = null;
class ct {
  options;
  lastData = {};
  managedTagKey;
  constructor(e) {
    this.options = e, this.managedTagKey = Math.random().toString(36).substring(7);
  }
  init() {
    N = this;
  }
  update(e) {
    e.reset !== !1 && (this.lastData = {}), this.lastData = { ...this.lastData, ...e };
    const t = this._compile(this.lastData);
    typeof window < "u" && window.document && this._updateDOM(t);
  }
  renderToString() {
    const e = this._compile(this.lastData), t = [], s = [];
    for (const r of e) {
      const n = this._renderTagToString(r);
      r.props.body ? s.push(n) : t.push(n);
    }
    return {
      headTags: t.join(`
    `),
      bodyTags: s.join(`
    `)
    };
  }
  _compile(e) {
    const t = [];
    if (this.options.title) {
      const n = this.options.title(e.title);
      n && t.push({ tag: "title", props: {}, innerHTML: n });
    } else e.title && t.push({ tag: "title", props: {}, innerHTML: e.title });
    const s = (n, o) => {
      if (n)
        for (const i in n) {
          const l = n[i], c = e[i];
          let u;
          typeof l == "function" ? u = l(c) : u = c !== void 0 ? c : l, u != null && t.push({
            tag: "meta",
            props: { [o]: i, content: String(u) }
          });
        }
    }, r = { ...this.options.namedMeta };
    if (this.options.description && (r.description = this.options.description), s(r, "name"), s(this.options.propertyMeta, "property"), s(this.options.httpEquivMeta, "http-equiv"), this.options.favicon) {
      let n;
      if (typeof this.options.favicon == "function" ? n = this.options.favicon(e.favicon) : n = e.favicon !== void 0 ? e.favicon : this.options.favicon, n) {
        const o = typeof n == "string" ? { href: n } : n;
        t.push({ tag: "link", props: { rel: "icon", ...o } });
      }
    }
    if (this.options.link)
      for (const n in this.options.link)
        (Array.isArray(this.options.link[n]) ? this.options.link[n] : [this.options.link[n]]).forEach((i) => {
          const l = typeof i == "string" ? { href: i } : i;
          t.push({ tag: "link", props: { rel: n, ...l } });
        });
    return this.options.script && this.options.script.forEach((n) => {
      const o = typeof n == "string" ? { src: n } : n;
      t.push({ tag: "script", props: o });
    }), e.children && e.children.forEach((n) => {
      const { elementTagType: o, innerHTML: i, ...l } = n;
      o && t.push({ tag: o, props: l, innerHTML: i });
    }), t;
  }
  _updateDOM(e) {
    const t = window.document, s = `[data-fictif-head="${this.managedTagKey}"]`;
    t.querySelectorAll(s).forEach((n) => n.remove());
    const r = e.find((n) => n.tag === "title");
    t.title = r?.innerHTML || "", e.forEach((n) => {
      if (n.tag === "title") return;
      const o = t.createElement(n.tag);
      o.setAttribute("data-fictif-head", this.managedTagKey);
      for (const [l, c] of Object.entries(n.props))
        c === !0 || c === "" ? o.setAttribute(l, "") : c !== !1 && c !== null && c !== void 0 && o.setAttribute(l, String(c));
      n.innerHTML && (o.innerHTML = n.innerHTML), (n.props.body ? t.body : t.head).appendChild(o);
    });
  }
  _renderTagToString(e) {
    if (e.tag === "title") return `<title>${e.innerHTML}</title>`;
    const t = Object.entries(e.props).map(([n, o]) => o === !0 || o === "" ? n : o === !1 || o === null || o === void 0 ? null : `${n}="${String(o).replace(/"/g, '"')}"`).filter(Boolean).join(" "), s = ["meta", "link", "base"].includes(e.tag), r = t ? " " + t : "";
    return s ? `<${e.tag}${r}>` : `<${e.tag}${r}>${e.innerHTML || ""}</${e.tag}>`;
  }
}
function me(a) {
  if (!a)
    return N || (N = Se(), N.init()), N;
  const e = Se(a);
  return N || e.init(), e;
}
function Se(a) {
  return new ct(a || {});
}
const He = typeof window < "u" && typeof window.document < "u";
class ut {
  store = /* @__PURE__ */ new Map();
  constructor() {
    He && this.add(document.cookie);
  }
  add(e) {
    if (typeof e == "string")
      e.split(";").forEach((t) => {
        const s = t.match(/([^=]+)=(.*)/);
        if (s) {
          const r = s[1].trim(), n = s[2].trim();
          r && this.store.set(r, n);
        }
      });
    else
      for (const [t, s] of Object.entries(e))
        this.store.set(t, String(s));
  }
  get(e) {
    return this.store.get(e);
  }
  getRecord() {
    return Object.fromEntries(this.store);
  }
}
const Ce = new ut(), J = {
  ABORTED: "ABORTED",
  NETWORK_ERROR: "NETWORK_ERROR",
  DEDUPED: "DEDUPED",
  TIMEOUT: "TIMEOUT",
  CACHE_ERROR: "CACHE_ERROR"
};
let Z = null;
const re = /* @__PURE__ */ new Map();
class ge {
  options;
  cache = /* @__PURE__ */ new Map();
  _extendPatterns = /* @__PURE__ */ new Map();
  constructor(e = {}) {
    e.inheritOptions !== !1 && Z ? this.options = this._deepMerge(Z.options, e) : this.options = e;
  }
  init() {
    Z = this;
  }
  before(e) {
    this.options.before = [...this.options.before || [], e];
  }
  after(e) {
    this.options.after = [...this.options.after || [], e];
  }
  onError(e) {
    this.options.onError = [...this.options.onError || [], e];
  }
  get(e, t) {
    return this.request(e, { ...t, method: "GET" });
  }
  post(e, t) {
    return this.request(e, { ...t, method: "POST" });
  }
  put(e, t) {
    return this.request(e, { ...t, method: "PUT" });
  }
  delete(e, t) {
    return this.request(e, { ...t, method: "DELETE" });
  }
  patch(e, t) {
    return this.request(e, { ...t, method: "PATCH" });
  }
  async request(e, t = {}) {
    let s = { ...t };
    const r = { ...this.options.extend, ...t.extend };
    for (const h in r) {
      const [w, b] = h.startsWith(":") ? h.substring(1).split(":", 2) : [null, h], R = (t.method || "GET").toUpperCase();
      if (this._getPatternRegex(b).test(e) && (!w || w.toUpperCase() === R)) {
        const m = r[h];
        s = m.inheritOptions === !1 ? m : this._deepMerge(s, m);
      }
    }
    const n = this._deepMerge({
      baseUrl: "",
      credentials: "include",
      timeout: 1e4,
      retries: 3,
      retryDelay: (h) => Math.min(h * 1e3, 3e4),
      retryCondition: (h) => (h.response?.status ?? 0) >= 500,
      dedupe: !0,
      debug: void 0,
      expectsJSON: !0,
      expectsDownloads: !1,
      bodyType: "auto",
      xsrf: !0,
      xsrfHeader: "X-XSRF-TOKEN",
      xsrfCookie: "XSRF-TOKEN",
      cacheTtl: 0,
      usesCache: !0,
      followRedirects: 5,
      caseSensitive: !1,
      strict: !1
    }, this.options, s), o = (h, w) => n.debug?.(h, w), i = typeof n.key == "string" ? n.key : null, l = this._getAutoKey(n, e, o), c = i ?? l;
    if (n.dedupe && c) {
      const h = re.get(c);
      if (h)
        if (i)
          o(`[DEDUPED] Aborting previous request for key: ${c}`), h.abort(), re.delete(c);
        else
          return o(`[DEDUPED] Reusing in-flight request for key: ${c}`), h.promise;
    }
    if (n.usesCache && l && this.cache.has(l)) {
      const h = this.cache.get(l);
      if (Date.now() - h.at < n.cacheTtl)
        return o(`[CACHE HIT] Using cached response for key: ${l}`), this._processResponse(h.response.clone(), n, o);
      this.cache.delete(l);
    }
    const u = new AbortController(), f = { abort: () => u.abort() }, d = new Promise(async (h, w) => {
      const b = this._mergeSignals(u.signal, n.signal), R = n.timeout && n.timeout > 0 ? setTimeout(() => u.abort(this._createError(J.TIMEOUT, "Request timed out")), n.timeout) : null, p = () => {
        R && clearTimeout(R);
      };
      b.addEventListener("abort", () => {
        p();
        const m = b.reason || this._createError(J.ABORTED, "Request was aborted");
        m?.code !== J.DEDUPED && w(m);
      });
      try {
        let m = 0;
        const C = n.retries === !0 ? 1 / 0 : n.retries || 0;
        for (; m <= C; )
          try {
            const y = this._buildURL(n.baseUrl, e, n.params), [v, T] = this._prepareBody(n, o), D = await this._prepareHeaders(n, T);
            let F = v;
            if (n.onUploadProgress && v) {
              const M = this._addUploadProgress(v, n.onUploadProgress, f);
              M && (F = M.body, M.total > 0 && D.set("Content-Length", String(M.total)));
            }
            const K = {
              method: n.method || "GET",
              headers: D,
              body: F,
              signal: b,
              credentials: n.credentials,
              redirect: n.followRedirects === !1 || n.followRedirects === 0 ? "manual" : "follow"
            }, $ = this._createRequest(y, K, n), O = {};
            $.headers.forEach((M, H) => {
              O[H] = M;
            }), o(`[REQUEST] ${$.method} ${$.url}`, { headers: O });
            let _;
            if (n.before)
              for (const M of n.before) {
                const H = await M($);
                if (H instanceof Response) {
                  _ = H, o("[MOCKED] Request was handled by a 'before' hook.");
                  break;
                }
              }
            const E = _ ?? await fetch($).catch((M) => {
              throw this._createError(J.NETWORK_ERROR, M.message);
            });
            if (!E.ok) throw await this._createErrorFromResponse(E);
            l && n.cacheTtl > 0 && this.cache.set(l, { response: E.clone(), at: Date.now(), options: n }), h(await this._processResponse(E, n, o)), p();
            return;
          } catch (y) {
            const v = y;
            if (b.aborted) throw v;
            m++;
            let T = n.retryCondition(v);
            if (n.onError)
              for (const D of n.onError)
                await D(v, m, n) === !1 && (T = !1);
            if (m > C || !T)
              throw p(), v;
            o(`[RETRY] Attempt ${m} failed. Retrying in ${n.retryDelay(m)}ms...`, { error: v.message }), await new Promise((D) => setTimeout(D, n.retryDelay(m)));
          }
      } catch (m) {
        p(), w(m);
      }
    });
    if (n.dedupe && c) {
      const h = () => u.abort(this._createError(J.DEDUPED, `Request with key '${c}' was superseded.`));
      re.set(c, { promise: d, abort: h }), d.finally(() => {
        re.delete(c);
      });
    }
    return d;
  }
  async _processResponse(e, t, s) {
    s(`[RESPONSE] ${e.status} ${e.statusText} from ${e.url}`);
    let r = e.clone();
    if (t.onDownloadProgress) {
      const o = this._addDownloadProgress(r, t.onDownloadProgress, { abort: () => {
      } });
      o && (r = o);
    }
    const n = await this._parseBody(r, t);
    if (t.after)
      for (const o of t.after) await o(e.clone(), n);
    return n;
  }
  // --- PRIVATE HELPERS ---
  _deepMerge(...e) {
    const t = (s) => s && typeof s == "object" && !Array.isArray(s);
    return e.reduce((s, r) => (r && Object.keys(r).forEach((n) => {
      const o = s[n], i = r[n];
      Array.isArray(o) && Array.isArray(i) ? s[n] = [...o, ...i] : t(o) && t(i) ? s[n] = this._deepMerge(o, i) : s[n] = i;
    }), s), {});
  }
  _getPatternRegex(e) {
    if (this._extendPatterns.has(e)) return this._extendPatterns.get(e);
    const t = "^" + e.replace(/(\/?)\*/g, "($1.*)?").replace(/:(\w+)(\?)?/g, (r, n, o) => o ? "(?:/([^/]+))?" : "([^/]+)") + (this.options.strict ? "" : "/?$"), s = new RegExp(t, this.options.caseSensitive ? "" : "i");
    return this._extendPatterns.set(e, s), s;
  }
  _getAutoKey(e, t, s) {
    if (typeof e.key == "function") return e.key();
    try {
      const r = e.method === "GET" ? void 0 : e.body, n = e.params ? Object.fromEntries(Object.entries(e.params).sort(([o], [i]) => o.localeCompare(i))) : void 0;
      return JSON.stringify({ path: t, method: e.method, params: n, body: r });
    } catch {
      return s("[WARN] Auto key generation failed for request with non-serializable body. Caching/Deduplication disabled."), null;
    }
  }
  _createRequest(e, t, s) {
    const r = new Request(e, t);
    return r.options = s, r;
  }
  _buildURL(e, t, s) {
    const n = e || "http://example.com", o = new URL(t, n);
    if (s) {
      const i = new URLSearchParams();
      for (const [l, c] of Object.entries(s))
        Array.isArray(c) ? c.forEach((u) => i.append(l, String(u))) : c != null && i.append(l, String(c));
      o.search = i.toString();
    }
    return e ? o.toString() : o.pathname + o.search + o.hash;
  }
  _prepareBody(e, t) {
    const { body: s, bodyType: r } = e;
    if (!s || typeof s != "object" || s instanceof Blob || s instanceof ArrayBuffer || s instanceof URLSearchParams || s instanceof ReadableStream)
      return [s, null];
    let n = r;
    if (r === "auto" && (n = Object.values(s).some((i) => i instanceof Blob) ? "formdata" : "json"), n === "json")
      return [JSON.stringify(s), "application/json"];
    if (n === "formdata") {
      const o = new FormData();
      for (const [i, l] of Object.entries(s)) o.append(i, l);
      return [o, null];
    }
    return [s, null];
  }
  async _prepareHeaders(e, t) {
    const s = new Headers(), r = this._deepMerge(this.options.headers, e.headers);
    for (const l in r) {
      const c = this.options.headers?.[l], u = e.headers?.[l];
      let f;
      typeof u == "function" ? f = await u(typeof c == "string" ? c : void 0) : typeof c == "function" ? f = await c(typeof u == "string" ? u : void 0) : f = u ?? c, f != null && s.set(l, f);
    }
    const n = {};
    (e.credentials === "include" || e.credentials === "same-origin") && Object.assign(n, Ce.getRecord());
    const o = this._deepMerge(this.options.cookies, e.cookies);
    for (const l in o) {
      const c = this.options.cookies?.[l], u = e.cookies?.[l];
      let f;
      typeof u == "function" ? f = await u(n[l]) : typeof c == "function" ? f = await c(n[l]) : f = u ?? c, f ? n[l] = f : delete n[l];
    }
    const i = Object.entries(n).map(([l, c]) => `${l}=${c}`).join("; ");
    if (i && s.set("Cookie", i), t && !s.has("Content-Type") && s.set("Content-Type", t), e.xsrf && !s.has(e.xsrfHeader)) {
      const l = Ce.get(e.xsrfCookie);
      l && s.set(e.xsrfHeader, decodeURIComponent(l));
    }
    return s;
  }
  _mergeSignals(...e) {
    const t = new AbortController();
    for (const s of e)
      if (s) {
        if (s.aborted) {
          t.abort(s.reason);
          break;
        }
        s.addEventListener("abort", () => t.abort(s.reason));
      }
    return t.signal;
  }
  _createError(e, t) {
    const s = new Error(t);
    return s.code = e, s;
  }
  async _createErrorFromResponse(e) {
    const t = new Error(`Request failed with status ${e.status}`);
    t.response = e.clone();
    try {
      (e.headers.get("content-type") || "").includes("application/json") ? t.data = await e.json() : t.data = await e.text();
    } catch {
      t.data = "Could not parse error response body.";
    }
    return t;
  }
  async _parseBody(e, t) {
    if (t.expectsDownloads) return e.blob();
    if (e.status === 204 || e.status === 205) return null;
    const s = e.headers.get("Content-Type") || "";
    return t.expectsJSON && s.includes("application/json") ? e.json() : e.text();
  }
  _addDownloadProgress(e, t, s) {
    const r = parseInt(e.headers.get("Content-Length") || "0", 10);
    if (!e.body) return null;
    let n = 0;
    const o = new ReadableStream({
      async start(i) {
        const l = e.body.getReader();
        for (; ; )
          try {
            const { done: c, value: u } = await l.read();
            if (c) break;
            n += u.length, t({ loaded: n, total: r }, s), i.enqueue(u);
          } catch (c) {
            i.error(c);
            break;
          }
        i.close();
      }
    });
    return new Response(o, { headers: e.headers, status: e.status, statusText: e.statusText });
  }
  _addUploadProgress(e, t, s) {
    if (!He && typeof e.on == "function") {
      const l = e, c = l.readableLength || 0;
      let u = 0;
      return l.on("data", (f) => {
        u += f.length, t({ loaded: u, total: c }, s);
      }), { body: l, total: c };
    }
    const r = e instanceof Blob ? e : new Blob([e]), n = r.size;
    if (n === 0) return null;
    let o = 0;
    return { body: new ReadableStream({
      async start(l) {
        const c = r.stream().getReader();
        for (; ; )
          try {
            const { done: u, value: f } = await c.read();
            if (u) break;
            o += f.length, t({ loaded: o, total: n }, s), l.enqueue(f);
          } catch (u) {
            l.error(u);
            break;
          }
        l.close();
      }
    }), total: n };
  }
}
function dt(a) {
  return a ? new ge(a) : Z || new ge();
}
function is(a) {
  const e = new ge(a);
  return e.init(), e;
}
function ht({
  prefix: a = "X-Inertia",
  version: e = null
  //page,
} = {}) {
  return async (t, s) => {
    const r = dt();
    let n = "static";
    typeof e == "function" ? n = e() || "static" : typeof e == "string" ? n = e : typeof e == "number" ? n = String(e) : t.old && (n = t.old.version || "static");
    const o = {
      "X-Requested-With": "XMLHttpRequest",
      [a]: "true",
      // Send the asset version on every visit
      ...n && { [a + "-Version"]: n },
      // Send partial reload headers if specified
      ...t.only?.length && {
        [a + "-Only"]: t.only.join(",")
        //[prefix + '-Partial-Component']: page.value.component as string,
      },
      ...t.headers
    };
    try {
      const i = await r.request(t.path || "/", {
        method: t.method,
        body: t.body,
        headers: o
      });
      return {
        path: i.url,
        // For inertia compatibility
        ...i
      };
    } catch (i) {
      if (!i.response)
        return s(t);
      const l = i.response;
      throw l.status === 409 && l.headers.get(a + "-Location") ? new Error("Asset version mismatch, forcing full reload.") : [301, 302].includes(l.status) ? (window.location.href = l.headers.get("Location") || t.path, new Error("Server-side redirect.")) : (l.status === 422, i);
    }
  };
}
const ft = /* @__PURE__ */ I({
  inheritAttrs: !1,
  __name: "display",
  props: {
    screen: {
      type: Object,
      required: !0
    },
    renderKey: {
      type: [String, Number],
      required: !0
    }
  },
  setup(a) {
    const e = a, t = Pe(), s = Q(null);
    let r = null;
    return j(() => e.screen, (n) => {
      if (!n) {
        s.value = null, r = null;
        return;
      }
      const o = n, i = o.layout || null;
      o.title, o.meta, i !== r && (i?.name && r?.name ? i.name !== r.name : i !== r) && (s.value = i, r = i);
    }, { immediate: !0 }), (n, o) => s.value ? (g(), L(qe, { key: 0 }, [
      (g(), L(q(s.value), Ve(We(oe(t))), {
        default: se(() => [
          (g(), L(q(a.screen), fe(oe(t), { key: a.renderKey }), null, 16))
        ]),
        _: 1
      }, 16))
    ], 1024)) : (g(), L(q(a.screen), fe({ key: 1 }, oe(t), { key: a.renderKey }), null, 16));
  }
}), $e = {
  inspirationalMessages: [
    {
      message: "Synchronizing Celestial Data Streams...",
      background: "/images/bg-1.png"
    },
    {
      message: "Initializing Delta Core Systems...",
      background: "/images/bg-2.png"
    },
    {
      message: "Calibrating Neural Interface...",
      background: "/images/bg-3.png"
    }
  ]
};
let ee = null;
class pt extends W {
  _state;
  _isMounted = !1;
  _hasRevealed = !1;
  inspirationalMessages;
  constructor(e = $e) {
    super(), this.inspirationalMessages = [...$e.inspirationalMessages, ...e.inspirationalMessages], this._state = U({
      keepers: [],
      mode: "full",
      title: "",
      message: "",
      background: "",
      component: null
    }), this.selectRandomMessage(), ee || this.init();
  }
  get state() {
    return this._state;
  }
  init() {
    ee = this, setTimeout(() => {
      this._isMounted && this.signalReady();
    }, 0);
  }
  setCurtainMounted(e) {
    const t = this._isMounted;
    this._isMounted = e, !t && e && this.signalReady();
  }
  signalReady() {
    this._hasRevealed || (this.emit("ready"), this._hasRevealed = !0);
  }
  selectRandomMessage() {
    if (this.inspirationalMessages.length === 0) return;
    const e = this.inspirationalMessages[Math.floor(Math.random() * this.inspirationalMessages.length)];
    this._state.message = e.message, this._state.background = e.background;
  }
  start(e = {}) {
    const { mode: t = "full", title: s, message: r, background: n, component: o } = e, i = this._state.keepers.length > 0;
    this._state.mode = t, t === "full" && (s && (this._state.title = s), r && (this._state.message = r), !s && !r && this.selectRandomMessage(), n && (this._state.background = n), o && (this._state.component = o));
    const l = () => {
      const c = this._state.keepers.indexOf(l);
      c !== -1 && (this._state.keepers.splice(c, 1), this._state.keepers.length === 0 && this.emit("hide"));
    };
    return this._state.keepers.push(l), i || this.emit("show"), l;
  }
  append(e) {
    this._state.component = e;
  }
  show() {
    return this.start({ component: this._state.component });
  }
  done() {
    const e = this._state.keepers.length > 0;
    this._state.keepers.length = 0, e && this.emit("hide");
  }
  /**
   * Internal method for the Curtain component to signal fade completion.
   */
  _signalFadeIn() {
    this.emit("fade-in");
  }
  _signalFadeOut() {
    this.emit("fade-out");
  }
  /**
   * For backwards compatibility or direct state tracking.
   */
  subscribe(e) {
    this.on("state-change", e);
  }
  unsubscribe(e) {
    this.off("state-change", e);
  }
}
function we(a) {
  return ee || (ee = new pt(a)), ee;
}
const mt = { class: "curtain-show" }, gt = { class: "curtain-show__bottom" }, yt = { class: "curtain-show__info" }, _t = { class: "curtain-show__title" }, vt = {
  key: 0,
  class: "curtain-show__message"
}, wt = /* @__PURE__ */ I({
  __name: "curtain-show",
  setup(a) {
    const e = we(), t = A(() => e.state.title), s = A(() => e.state.message);
    return (r, n) => (g(), x("div", mt, [
      n[0] || (n[0] = ze('<div class="curtain-show__center" data-v-ae95ee93><svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="curtain-show__icon" data-v-ae95ee93><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v1.244c0 .892-.56 1.685-1.393 1.986l-1.92.693a1.5 1.5 0 01-1.986-1.393V4.39c0-.892.56-1.685 1.393-1.986l1.92-.693a1.5 1.5 0 011.986 1.393zM2.25 12c0-4.078 2.5-7.5 6-8.82M21.75 12c0 4.078-2.5 7.5-6 8.82m0-17.64c3.5 1.32 6 4.742 6 8.82m-13.5 8.82c-3.5-1.32-6-4.742-6-8.82" data-v-ae95ee93></path><circle cx="12" cy="12" r="3" data-v-ae95ee93></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v.008m0 5.984v.008M9 12h.008m5.984 0h.008" data-v-ae95ee93></path></svg></div>', 1)),
      S("div", gt, [
        S("div", yt, [
          S("h2", _t, V(t.value || "Did you know?"), 1),
          s.value ? (g(), x("p", vt, V(s.value), 1)) : P("", !0)
        ])
      ])
    ]));
  }
}), ue = (a, e) => {
  const t = a.__vccOpts || a;
  for (const [s, r] of e)
    t[s] = r;
  return t;
}, bt = /* @__PURE__ */ ue(wt, [["__scopeId", "data-v-ae95ee93"]]), kt = { class: "curtain__content" }, xt = { class: "curtain__custom" }, Rt = {
  key: 1,
  class: "curtain__light-spinner"
}, Et = {
  __name: "curtain",
  setup(a) {
    const e = k(!1), t = k("full"), s = k(null), r = we();
    let n = !1;
    const o = () => {
      if (n) return;
      const d = document.querySelectorAll(".fictif-pre-curtain");
      for (const h of d)
        h.style.transition = "opacity 0.5s ease", h.style.opacity = "0", setTimeout(() => h.remove(), 500);
      n = !0;
    }, i = () => {
      o(), r._signalFadeIn();
    }, l = () => {
      r._signalFadeOut();
    }, c = () => {
      const d = r.state;
      e.value = d.keepers.length > 0, t.value = d.mode, s.value = d.component;
    };
    z(() => {
      c(), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          r.setCurtainMounted(!0);
        });
      }), j(() => r.state.keepers.length, c), j(() => r.state.mode, c), j(() => r.state.component, c), X(() => {
        e.value || o();
      });
    }), ye(() => {
      r.setCurtainMounted(!1), f();
    });
    const u = () => {
      document.body.style.overflow = "hidden";
    }, f = () => {
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    };
    return j(e, (d) => {
      d ? u() : f();
    }), (d, h) => (g(), L(De, {
      name: "curtain-fade",
      onAfterEnter: i,
      onAfterLeave: l
    }, {
      default: se(() => [
        e.value ? (g(), x("div", {
          key: 0,
          class: ae(["fictif-curtain", `fictif-curtain--${t.value}`]),
          role: "dialog",
          "aria-modal": "true",
          "aria-busy": "true",
          "aria-live": "assertive"
        }, [
          t.value === "full" ? (g(), x(G, { key: 0 }, [
            h[0] || (h[0] = S("div", { class: "curtain__overlay" }, null, -1)),
            S("div", kt, [
              S("div", xt, [
                (g(), L(q(s.value || bt)))
              ])
            ])
          ], 64)) : P("", !0),
          t.value === "light" ? (g(), x("div", Rt, [...h[1] || (h[1] = [
            S("div", { class: "curtain__spinner" }, null, -1)
          ])])) : P("", !0)
        ], 2)) : P("", !0)
      ]),
      _: 1
    }));
  }
}, Tt = /* @__PURE__ */ ue(Et, [["__scopeId", "data-v-16edb64d"]]), Mt = /* @__PURE__ */ I({
  __name: "head",
  setup(a) {
    const e = Pe(), t = Oe();
    let s;
    try {
      s = me();
    } catch {
      console.error("[Fictif Head] Missing global head manager. Did you forget to provide it?");
    }
    const r = () => {
      const o = { children: [] };
      if (!t.default) return o;
      const i = (l) => {
        for (const c of l)
          if (!(!c || c.type === Je || c.type === ke)) {
            if (c.type === G && Array.isArray(c.children)) {
              i(c.children);
              continue;
            }
            if (typeof c.type == "string") {
              let u = "";
              Array.isArray(c.children) ? u = c.children.map((f) => typeof f == "string" ? f : f.type === ke ? f.children : "").join("") : typeof c.children == "string" && (u = c.children), c.type.toLowerCase() === "title" ? o.title = u : o.children.push({
                elementTagType: c.type,
                innerHTML: u || void 0,
                ...c.props || {}
              });
            }
          }
      };
      return i(t.default()), o;
    }, n = () => {
      if (!s) return;
      const o = { ...e }, i = r(), l = {
        reset: !0,
        ...o,
        ...i,
        children: [
          ...o.children || [],
          ...i.children || []
        ]
      };
      s.update(l);
    };
    return z(() => {
      n(), Ge(n);
    }), ye(() => {
      s && s.update({ reset: !0 });
    }), (o, i) => null;
  }
}), St = I({
  name: "M",
  props: {
    source: String
  },
  setup(a, { slots: e }) {
    const t = new nt({
      html: !0,
      linkify: !0,
      typographer: !0
    }), s = de && de.default || de;
    s && t.use(s);
    const r = (n) => n.map((o) => typeof o.children == "string" ? o.children : Array.isArray(o.children) ? r(o.children) : "").join("");
    return () => {
      let n = "";
      return a.source ? n = a.source : e.default && (n = r(e.default())), n && n.trim().length > 0 ? Y("div", {
        class: "prose prose-montserrat dark:prose-invert",
        innerHTML: t.render(n)
      }) : Y("div", { class: "prose prose-montserrat dark:prose-invert" }, e.default ? e.default() : []);
    };
  }
}), Ae = {
  install(a) {
    a.component("Head", Mt), a.component("M", St);
  }
};
async function as(a) {
  let {
    mountTo: e = "#app",
    setup: t,
    progress: s = {},
    resolve: r,
    initialData: n = void 0,
    copyInitialData: o = !0,
    isSSR: i = void 0,
    appName: l = "App"
  } = typeof a == "object" && a ? a : {}, c, u;
  B ? c = pe() : c = pe({
    handle: ht()
  }), N ? u = me() : (u = me({
    // maybe some default config
    title: (p) => p ? p + " | " + l : l
  }), u.init());
  const f = r || ot().resolve;
  if (typeof e == "string") {
    const p = document.querySelector(e);
    if (!p)
      throw new Error(
        `[Fictif] Given 'mountTo' query selector didnt resolve to an html element, given: "${e}".`
      );
    e = p;
  }
  if (!e && typeof t != "function")
    throw new Error("[Fictif] Didnt receive a root element to mount to.");
  const d = Q({
    component: "",
    props: {},
    path: location.pathname,
    version: "static"
    // Handled in other places
  });
  c.on(
    "push",
    async ({
      page: p,
      options: m
    }) => {
      const C = typeof p.component == "string" ? await f(p.component) : p.component;
      if ((typeof m.preserveScroll == "boolean" ? !m.preserveScroll : d.value.component != C) && window.scrollTo(0, 0), m.only?.length) {
        const y = { ...p.value.props, ...p.props };
        d.value = { ...p, props: y, component: C };
      } else
        d.value = { ...p, component: C };
    }
  ), async function() {
    await c.init(), o && e && e.dataset.page ? n = JSON.parse(e.dataset.page) : typeof n == "string" && (n = JSON.parse(n)), n ? await c.push(n) : await c.visit(location.pathname);
  }();
  const h = {
    name: "FictifAppRoot",
    setup() {
      return z(() => {
        document.body.classList.add("fictif-app-mounted");
      }), () => {
        const p = Y("div", { id: "fictif-root-wrapper" }, [
          Y(Tt, {}),
          d.value && typeof d.value.component == "object" ? Y(ft, {
            key: d.value.path,
            // @ts-ignore
            screen: d.value.component,
            renderKey: `${d.value.path}-${Date.now()}`,
            ...d.value.props
          }) : void 0
        ]);
        return u.update({ reset: !1 }), p;
      };
    }
  };
  let w;
  t ? w = t({ el: e, App: h, plugin: Ae }) : (w = (typeof i == "boolean" ? i : e && e.hasAttribute("data-server-rendered")) ? Xe(h) : Qe(h), w.use(Ae)), e && w.mount(e);
  const b = we(), R = b.start();
  s != !1 && c.on("navigation", () => {
    let p, m;
    const C = () => {
      clearTimeout(p), R(), m?.();
    };
    p = window.setTimeout(
      () => {
        m = b.start();
      },
      s?.delay || 300
    ), c.once("ready", C);
  });
}
function te(a) {
  if (a === null || typeof a != "object")
    return a;
  if (a instanceof Date)
    return new Date(a.getTime());
  if (a instanceof File)
    return a;
  if (Array.isArray(a)) {
    const t = [];
    for (let s = 0; s < a.length; s++)
      t[s] = te(a[s]);
    return t;
  }
  const e = {};
  for (const t in a)
    Object.prototype.hasOwnProperty.call(a, t) && (e[t] = te(a[t]));
  return e;
}
function ls(a, e = {}) {
  const t = typeof a == "function" ? a() : a, s = U(te(t)), r = te(t), n = U({}), o = k(!1), i = k(!1), l = k(!1), c = k(null), u = k(!1);
  let f = null;
  const d = pe();
  j(
    s,
    () => {
      u.value = JSON.stringify(s) !== JSON.stringify(r);
    },
    { deep: !0 }
  );
  const h = A(() => Object.keys(n).length > 0), w = (...y) => {
    (y.length > 0 ? y : Object.keys(n)).forEach((T) => {
      delete n[T];
    });
  }, b = (...y) => {
    (y.length > 0 ? y : Object.keys(r)).forEach((T) => {
      s[T] = r[T];
    }), u.value = !1, i.value = !1, l.value = !1, f && clearTimeout(f), w();
  }, R = (y, v) => {
    s[y] = v;
  }, p = async (y) => {
    o.value = !0;
    try {
      return await y();
    } finally {
      o.value = !1;
    }
  }, m = (y, v, T = {}) => {
    const D = e.transform ? e.transform(s) : s, F = {
      ...T,
      method: y,
      body: D
    };
    o.value = !0, i.value = !1, l.value = !1, f && clearTimeout(f), w(), T.onStart?.();
    const K = (_) => {
      Object.assign(r, te(s)), u.value = !1, i.value = !0, l.value = !0, T.onSuccess?.(_.page), f = window.setTimeout(
        () => l.value = !1,
        e.successfulTimeout ?? 2e3
      );
    }, $ = (_) => {
      const M = _.error?.response?.data?.errors ?? {};
      Object.assign(n, M), T.onError?.(n);
    }, O = () => {
      o.value = !1, d.off("push", K), d.off("error", $), d.off("ready", O), d.off("navigated", O), T.onFinish?.();
    };
    d.once("push", K), d.once("error", $), d.once("ready", O), d.visit(v, F).catch($);
  };
  return U({
    ...Ye(s),
    data: s,
    isDirty: u,
    errors: n,
    hasErrors: h,
    processing: o,
    progress: c,
    wasSuccessful: i,
    recentlySuccessful: l,
    submit: m,
    get: (y, v) => m("GET", y, v),
    post: (y, v) => m("POST", y, v),
    put: (y, v) => m("PUT", y, v),
    patch: (y, v) => m("PATCH", y, v),
    delete: (y, v) => m("DELETE", y, v),
    process: p,
    reset: b,
    clearErrors: w,
    setData: R
  });
}
function cs(a, e = 300, t = 10) {
  if (a || (a = document.querySelector("main")), !a || !(a instanceof HTMLElement) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = performance.now(), n = a.style.transform;
  function o(i) {
    if (i - r >= e) {
      a.style.transform = n;
      return;
    }
    const c = (Math.random() * 2 - 1) * t, u = (Math.random() * 2 - 1) * t;
    a.style.transform = `translate(${c}px, ${u}px)`, requestAnimationFrame(o);
  }
  requestAnimationFrame(o);
}
const ie = U({
  snackbars: []
});
class Ct {
  id;
  icon;
  message;
  autoCloseInterval;
  buttons;
  _onClose;
  _onClick;
  constructor(e) {
    this.id = Date.now().toString(36) + Math.random().toString(36).substring(2), this.icon = e.icon || null, this.message = e.message || "", this.autoCloseInterval = e.autoCloseInterval || 0, this.buttons = e.buttons || {}, this._onClose = () => {
    }, this._onClick = () => {
    }, this.close = this.close.bind(this);
  }
  set onClose(e) {
    typeof e == "function" && (this._onClose = e);
  }
  set onClick(e) {
    typeof e == "function" && (this._onClick = e);
  }
  close(e = "manual") {
    const t = ie.snackbars.findIndex((s) => s.id === this.id);
    t > -1 && (ie.snackbars.splice(t, 1), this._onClose(e));
  }
}
function $t() {
  const a = (e) => {
    const t = new Ct(e);
    return ie.snackbars.push(t), t;
  };
  return {
    snackbars: ie.snackbars,
    fire: a
  };
}
const At = {
  key: 0,
  class: "fictif-snack-choose__desc"
}, Pt = {
  key: 1,
  class: "fictif-snack-choose__input-wrapper"
}, Dt = ["placeholder"], Ot = {
  key: 2,
  class: "fictif-snack-choose__actions"
}, Lt = ["onClick"], Ht = /* @__PURE__ */ I({
  __name: "snack-choose",
  props: {
    options: {}
  },
  emits: ["result"],
  setup(a, { emit: e }) {
    const t = a, s = e, r = k(null), n = k(null), o = k(""), i = k(0);
    A(() => t.options.textbox && i.value === 0), z(() => {
      t.options.actions && t.options.actions.length > 0, setTimeout(() => {
        r.value?.focus(), t.options.textbox && (i.value = 0, n.value?.focus());
      }, 50);
    });
    function l(u) {
      u.stopPropagation();
      const f = t.options.actions?.length || 0, d = !!t.options.textbox, h = (d ? 1 : 0) + f;
      if (u.key === "ArrowUp")
        u.preventDefault(), i.value = (i.value - 1 + h) % h;
      else if (u.key === "ArrowDown")
        u.preventDefault(), i.value = (i.value + 1) % h;
      else if (u.key === "ArrowLeft" || u.key === "ArrowRight")
        d && i.value === 0 || u.preventDefault();
      else if (u.key === "Enter")
        if (u.preventDefault(), d && i.value === 0)
          s("result", o.value);
        else {
          const w = d ? i.value - 1 : i.value;
          t.options.actions && t.options.actions[w] ? s("result", t.options.actions[w].id) : d && !t.options.actions?.length && s("result", o.value);
        }
      else u.key === "Escape" ? t.options.default !== !1 && s("result", typeof t.options.default == "string" ? t.options.default : null) : u.key.length === 1 && !u.ctrlKey && !u.metaKey && !u.altKey && d && i.value !== 0 && (i.value = 0, n.value?.focus());
    }
    function c(u) {
      s("result", u);
    }
    return j(i, (u) => {
      u === 0 && t.options.textbox ? n.value?.focus() : (n.value?.blur(), r.value?.focus());
    }), (u, f) => (g(), x("div", {
      class: "fictif-snack-choose",
      tabindex: "0",
      ref_key: "containerRef",
      ref: r,
      onKeydown: Ze(l, ["stop"])
    }, [
      a.options.description ? (g(), x("div", At, V(a.options.description), 1)) : P("", !0),
      a.options.textbox ? (g(), x("div", Pt, [
        et(S("input", {
          ref_key: "inputRef",
          ref: n,
          type: "text",
          "onUpdate:modelValue": f[0] || (f[0] = (d) => o.value = d),
          class: "fictif-snack-choose__input",
          placeholder: typeof a.options.textbox == "string" ? a.options.textbox : ""
        }, null, 8, Dt), [
          [tt, o.value]
        ])
      ])) : P("", !0),
      a.options.actions && a.options.actions.length > 0 ? (g(), x("div", Ot, [
        (g(!0), x(G, null, le(a.options.actions, (d, h) => (g(), x("button", {
          key: d.id,
          class: ae(["fictif-snack-choose__btn", { "fictif-snack-choose__btn--active": i.value === h }]),
          onClick: (w) => c(d.id)
        }, V(d.content), 11, Lt))), 128))
      ])) : P("", !0)
    ], 544));
  }
}), It = /* @__PURE__ */ ue(Ht, [["__scopeId", "data-v-8b0f8a51"]]);
class Ft {
  items = U([]);
  choose(e) {
    const t = Date.now().toString(36) + Math.random().toString(36).slice(2), s = Q(null), r = Q(!0);
    let n = null, o = () => {
    };
    const i = new Promise((c) => {
      o = c;
    }), l = {
      id: t,
      result: s,
      showing: r,
      wait: () => i,
      destroy: () => {
        n && clearTimeout(n), r.value = !1, setTimeout(() => {
          const c = this.items.findIndex((u) => u.id === t);
          c !== -1 && this.items.splice(c, 1);
        }, 300), o(s.value);
      },
      component: xe(It),
      props: {
        options: e,
        onResult: (c) => {
          s.value = c, l.destroy();
        }
      }
    };
    return e.timeout && e.timeout > 0 && (n = window.setTimeout(() => {
      e.default !== !1 && (s.value = typeof e.default == "string" ? e.default : null), l.destroy();
    }, e.timeout)), this.items.push(l), l;
  }
  append(e, t = {}) {
    const s = Date.now().toString(36) + Math.random().toString(36).slice(2), r = Q(!0), n = {
      id: s,
      showing: r,
      destroy: () => {
        r.value = !1, setTimeout(() => {
          const o = this.items.findIndex((i) => i.id === s);
          o !== -1 && this.items.splice(o, 1);
        }, 300);
      },
      component: xe(e),
      props: t
    };
    return this.items.push(n), n;
  }
}
const Ie = new Ft();
function Nt(a) {
  return a || Ie;
}
const jt = { class: "fictif-multistep-wrapper h-full w-full" }, Bt = {
  key: 0,
  class: "fictif-multistep__overlay"
}, Ut = 50, us = {
  __name: "multi-step",
  emits: ["before-leave", "after-leave"],
  setup(a, { expose: e, emit: t }) {
    const s = t, r = Oe(), n = k(null), o = k(null), i = k(null), l = k(!1), c = k("next"), u = k(0), f = A(
      () => r.default ? r.default().map((_) => _.props.name) : Object.keys(r)
    ), d = k(0), h = A(() => f.value[d.value]), w = A(() => `ms-slide-${c.value}`), b = k(h.value), R = k(0), p = k(0), m = A(
      () => d.value < f.value.length - 1
    ), C = A(() => d.value > 0);
    function y(_) {
      if (!_) return { w: 0, h: 0 };
      const { width: E, height: M } = _.getBoundingClientRect();
      return { w: Math.round(E), h: Math.round(M) };
    }
    z(async () => {
      await X();
      const { w: _, h: E } = y(o.value);
      R.value = _, p.value = E;
    });
    async function v(_) {
      if (l.value || _ < 0 || _ >= f.value.length || _ === d.value)
        return;
      let E = !1;
      const M = () => E = !0;
      let H;
      const be = _ > d.value ? "next" : "prev", Fe = {
        from: h.value,
        to: f.value[_],
        direction: be,
        next: () => H(),
        cancel: M
      };
      if (await new Promise((Ke) => {
        H = Ke, s("before-leave", Fe), H();
      }), E) return;
      await X();
      const { w: Ne, h: je } = y(o.value);
      b.value = f.value[_], await X();
      const { w: Be, h: Ue } = y(i.value);
      c.value = be, d.value = _, l.value = !0, R.value = Ne, p.value = je, await X(), R.value = Be, p.value = Ue;
    }
    function T() {
      l.value = !1, s("after-leave", { current: h.value });
    }
    const D = (_) => u.value = _.touches[0].clientX, F = (_) => {
      const E = _.changedTouches[0].clientX - u.value;
      Math.abs(E) < Ut || (E < 0 ? $() : O());
    }, K = (_) => {
      const E = f.value.indexOf(_);
      v(E);
    }, $ = () => m.value && v(d.value + 1), O = () => C.value && v(d.value - 1);
    return e({
      goto: K,
      next: $,
      back: O,
      currentStep: h,
      currentStepIndex: d,
      steps: f,
      canGoNext: m,
      canGoBack: C
    }), (_, E) => (g(), x("div", jt, [
      S("div", {
        ref_key: "container",
        ref: n,
        class: "fictif-multistep",
        style: st({ width: R.value + "px", height: p.value + "px" }),
        onTouchstart: D,
        onTouchend: F
      }, [
        l.value ? (g(), x("div", Bt)) : P("", !0),
        _e(De, {
          name: w.value,
          onAfterEnter: T
        }, {
          default: se(() => [
            h.value ? (g(), x("div", {
              key: h.value,
              class: "fictif-multistep__step",
              ref: "stepEl"
            }, [
              S("div", {
                class: "fictif-multistep__content",
                ref_key: "contentEl",
                ref: o
              }, [
                Re(_.$slots, h.value)
              ], 512)
            ])) : P("", !0)
          ]),
          _: 3
        }, 8, ["name"])
      ], 36),
      S("div", {
        ref_key: "sizerEl",
        ref: i,
        class: "fictif-multistep__sizer"
      }, [
        Re(_.$slots, b.value)
      ], 512)
    ]));
  }
}, Kt = {
  key: 0,
  class: "flex-shrink-0 mr-3"
}, qt = { class: "flex-grow text-sm font-medium" }, Vt = { class: "flex-shrink-0 ml-4 flex items-center gap-2" }, Wt = ["onClick"], zt = /* @__PURE__ */ I({
  __name: "snackbar-item",
  props: {
    snackbar: {}
  },
  setup(a) {
    const e = a, t = k(null), s = k(!1), r = () => {
      e.snackbar.autoCloseInterval > 0 && !s.value && (t.value = setTimeout(() => {
        e.snackbar.close("interval");
      }, e.snackbar.autoCloseInterval));
    }, n = () => {
      s.value = !0, t.value && clearTimeout(t.value);
    }, o = () => {
      s.value = !1, r();
    }, i = (l, c) => {
      c.closes ? e.snackbar.close(l) : e.snackbar._onClick(l);
    };
    return z(() => {
      r();
    }), ye(() => {
      t.value && clearTimeout(t.value);
    }), (l, c) => (g(), x("div", {
      onMouseenter: n,
      onMouseleave: o,
      class: "w-full max-w-lg mt-4 bg-slate-800 text-slate-200 rounded-lg shadow-2xl shadow-black/50 pointer-events-auto ring-1 ring-black/5 flex items-center p-4"
    }, [
      a.snackbar.icon ? (g(), x("div", Kt, [
        (g(), L(q(a.snackbar.icon), { class: "h-6 w-6" }))
      ])) : P("", !0),
      S("div", qt, V(a.snackbar.message), 1),
      S("div", Vt, [
        (g(!0), x(G, null, le(a.snackbar.buttons, (u, f) => (g(), x("button", {
          key: f,
          onClick: (d) => i(String(f), u),
          class: ae([
            "px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
            u.additionalClasses || "bg-slate-700 hover:bg-slate-600"
          ])
        }, V(u.text), 11, Wt))), 128))
      ])
    ], 32));
  }
}), Gt = {
  "aria-live": "assertive",
  class: "fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 z-[100]"
}, Jt = { class: "w-full flex flex-col-reverse items-center space-y-4 space-y-reverse" }, ds = /* @__PURE__ */ I({
  __name: "snackbar-container",
  setup(a) {
    const { snackbars: e } = $t();
    return (t, s) => (g(), x("div", Gt, [
      S("div", Jt, [
        _e(Le, {
          tag: "div",
          "enter-active-class": "transform ease-out duration-300 transition",
          "enter-from-class": "translate-y-2 opacity-0 sm:translate-y-0",
          "enter-to-class": "translate-y-0 opacity-100 sm:translate-x-0",
          "leave-active-class": "ease-in duration-200 transition",
          "leave-from-class": "opacity-100",
          "leave-to-class": "opacity-0",
          class: "w-full max-w-lg flex flex-col items-center"
        }, {
          default: se(() => [
            (g(!0), x(G, null, le(oe(e), (r) => (g(), L(zt, {
              key: r.id,
              snackbar: r
            }, null, 8, ["snackbar"]))), 128))
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Xt = /* @__PURE__ */ I({
  __name: "snack-container",
  props: {
    manager: {},
    global: { type: Boolean }
  },
  setup(a) {
    const e = a, t = A(() => e.manager ? e.manager : e.global ? Ie : Nt()), s = A(() => e.global || !e.manager && e.global !== !1), r = A(() => t.value.items);
    return (n, o) => (g(), x("div", {
      class: ae(["fictif-snack-container", { "fictif-snack-container--global": s.value }])
    }, [
      _e(Le, {
        name: "snack-list",
        tag: "div",
        class: "fictif-snack-container__list"
      }, {
        default: se(() => [
          (g(!0), x(G, null, le(r.value, (i) => (g(), x("div", {
            key: i.id,
            class: "fictif-snack-container__item-wrapper"
          }, [
            i.showing ? (g(), L(q(i.component), fe({
              key: 0,
              ref_for: !0
            }, i.props, {
              onClose: (l) => i.destroy()
            }), null, 16, ["onClose"])) : P("", !0)
          ]))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}), hs = /* @__PURE__ */ ue(Xt, [["__scopeId", "data-v-a55db593"]]);
export {
  ge as API,
  Tt as Curtain,
  pt as CurtainManager,
  ft as Display,
  W as EventEmitter,
  Ae as FictifVuePlugin,
  Mt as Head,
  ct as HeadManager,
  St as M,
  us as MultiStep,
  ve as RouteGroup,
  at as RouteMap,
  ne as Router,
  It as SnackChoose,
  hs as SnackContainer,
  Ft as SnackManager,
  Ct as Snackbar,
  ds as SnackbarContainer,
  zt as SnackbarItem,
  rs as back,
  ts as createEmitter,
  as as createFictifApp,
  ht as createInertiaHandler,
  $e as defaultsCurtain,
  J as errorCodes,
  Z as globalAPI,
  ee as globalCurtain,
  N as globalHead,
  B as globalRouter,
  Ie as globalSnackManager,
  is as initAPI,
  Ce as jar,
  ns as page,
  os as redirect,
  ss as response,
  cs as shakeElement,
  lt as shouldInterceptLink,
  dt as useAPI,
  $t as useAlerts,
  we as useCurtain,
  ls as useForm,
  me as useHead,
  ot as usePages,
  pe as useRouter,
  Nt as useSnack
};
