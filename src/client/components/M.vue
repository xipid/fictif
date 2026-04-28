<script lang="ts">
import { defineComponent, h, type VNode, Text, type SetupContext } from 'vue';

import MarkdownIt from 'markdown-it';
// @ts-ignore
import mathjax3 from 'markdown-it-mathjax3';

export default defineComponent({
  name: 'M',
  props: {
    source: String,
  },
  setup(props, { slots }: SetupContext) {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });

    // Handle potential default export mismatch for MathJax
    const mjPlugins = (mathjax3 && mathjax3.default) || mathjax3;
    if (mjPlugins) {
      md.use(mjPlugins);
    }

    const extractText = (nodes: VNode[]): string => {
      return nodes.map(node => {
        if (typeof node.children === 'string') {
          return node.children;
        } else if (Array.isArray(node.children)) {
          return extractText(node.children as VNode[]);
        }
        return '';
      }).join('');
    };

    return () => {
      let content = '';

      if (props.source) {
        content = props.source;
      } else if (slots.default) {
        content = extractText(slots.default());
      }

      // If we extracted valid markdown content, render it
      if (content && content.trim().length > 0) {
        return h('div', {
          class: 'prose prose-montserrat dark:prose-invert',
          innerHTML: md.render(content)
        });
      }


      // Fallback
      return h('div', { class: 'prose prose-montserrat dark:prose-invert' }, slots.default ? slots.default() : []);
    };
  },
});
</script>

<style>
/* 
 * MathJax Accessibility & Display Fixes 
 * Hides assistive MathML to prevent UI duplication/glitches
 */
mjx-assistive-mml {
  display: none !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden !important;
}

mjx-container {
  display: inline-block;
  vertical-align: middle;
}
</style>
