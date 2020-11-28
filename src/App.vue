<!--
 * @Descripttion: SQL编辑器
 * @Author: yuyi
 * @Date: 2020-11-28 19:25:09
 * @LastEditors: yuyi
 * @LastEditTime: 2020-11-29 00:13:39
-->
<template>
  <div class="editor">
    <header>
      <span>运行SQL</span>
    </header>
    <codemirror v-model="code" :options="cmOptions" @ready="onCmReady" ref="codemirror"></codemirror>
    <!-- 负责拖拽 -->
    <!-- 当鼠标指针移动到元素上方,并按下鼠标左键时,会发生 mousedown 事件 -->
    <div class="editor__drag">
      <div class="arrow-v" @mousedown="changeEditorHeight">
        <img src="~@/assets/png/editor-drag.png" style="width: 1.5rem; height: 1.5rem; vertical-align: middle;" />
      </div>
    </div>
    <div class="editor__run">
      <button class="btn btnRun">执行</button>
      <button class="btn btnRun" @click="autoFormatSelection">格式化</button>
    </div>
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/sql/sql.js' // 对于sql模式的支持
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import sqlFormatter from "sql-formatter";

// 设置编辑器的最小高度是200
const MIN_HEIGHT = 350
export default {
  name: 'CodeMirrorEditor',
  components: {
    codemirror
  },
  computed: {
    codemirror() {
      return this.$refs.codemirror.codemirror
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.codemirror.setSize('height', MIN_HEIGHT)
      // 获取当前编辑器的初始高度
      let height= this.$refs.codemirror.$el.offsetHeight
      console.log('编辑器初始高度：', height)
    })
  },
  data() {
    return {
      code: "INSERT INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99) ON DUPLICATE KEY UPDATE name='小明', gender='F', score=99;",
      cmOptions: {
        mode: "text/x-sql", //实现Java代码高亮
        lineNumbers: true,
        theme: "dracula",
        keyMap: "sublime",
        extraKeys: {"Ctrl":"autocomplete"},
        lineWrapping: true, //是否换行
        foldGutter: true, //是否折叠
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], //添加行号栏，折叠栏
      },
      position_initail_y: 0,
      position_y: 0,
    }
  },
  methods: {
    onCmReady(cm) {
      cm.on('keypress', () => {
          cm.showHint()
      })
    },
    getEditorHeight() {
      return this.$refs.codemirror.$el.offsetHeight
    },
    changeEditorHeight(event) {
      // 防止触发drag事件
      if (event.stopPropagation) event.stopPropagation();
      if (event.preventDefault) event.preventDefault();
      // 1. 记录当前坐标Y的位置，用于随时更新高度
      this.position_initail_y = event.y
      // 注册鼠标滑动事件
      document.body.addEventListener('mousemove', this.changeEditorMove)
      // mouseup会消失，具体表现就是，鼠标按下，抬起后，编辑器高度依旧跟着改变，如下摘录自简书
      // 触发了浏览器的 drag 操作，导致mouseup丢失。
      // 由于鼠标离开了操作的区域，触发了mouseleave导致mouseup丢失。
      document.body.addEventListener('mouseup', this.releaseMouse)
    },
    releaseMouse() {
      // 当鼠标抬起，此时不再计算实时的距离，清除刚才的事件
      document.body.removeEventListener('mousemove', this.changeEditorMove)
      document.body.removeEventListener('mouseup', this.releaseMouse)
    },
    changeEditorMove(event) {
      // 1. 记录鼠标最后停止的位置
      this.position_y = event.y
      // 2. 实时更新当前已经移动了多少
      const moveLength = Math.max(MIN_HEIGHT, MIN_HEIGHT + (this.position_y - this.position_initail_y))
      this.codemirror.setSize('height', moveLength)
    },
    getSelectedRange() {
        return { from: this.codemirror.getCursor(true), to: this.codemirror.getCursor(false) };
    },
    autoFormatSelection() {
      let str = sqlFormatter.format(this.codemirror.getValue(), {language: 'sql'});
      this.codemirror.setValue(str);
    }
  }
}
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console",
    "Courier New", monospace;
}
header {
  width: 100%;
  height: 30px;
  background-color: #1d364a;
  line-height: 30px;
  color: #fff;
}
header > span {
  font-weight: 800;
  margin-left: 1.5rem;
}
.btn {
  display: inline-block;
  text-align: center;
  background-color: #23bede;
  padding: 10px 0;
  width: 110px;
  color: #fff;
  font-size: 16px;
  border-radius: 3px;
  border: none 0;
  cursor: pointer;
  line-height: normal;
  outline: 0;
  white-space: nowrap;
  margin: 0.2rem;
}
.editor__run {
  text-align: center;
  background-color: #d8f0f5;
}
.editor__drag {
  background: #3d444c;
  user-select: none;
  cursor: row-resize;
  text-align: center;
  line-height: 20px;
}
.arrow-v {
  background-color: #161b1e;
  display: inline-block;
  width: 2rem;
  line-height: inherit;
}
</style>
