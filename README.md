## pdf-reader
使用pdfjs-dist解析pdf文件
使用web component方式构建，这种方式可以兼容当前各种框架

### 使用
- 支持原生html使用
- 支持vue/react/angular 

### html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="/dist/main.bundle.js" defer></script>
    </head>
    <body>
        <pdf-view
            url="/demo/1.pdf"
            style="width: 100%; height: 800px"
        ></pdf-view>
    </body>
</html>
```

### vue
```vue
<script setup>
import "@yangxuy/pdf-reader"
import pdf from './assets/1.pdf'
</script>

<template>
  <pdf-view :url="pdf" style="width: 100%; height: 800px"></pdf-view>
</template>
```

### React
```js
import pdf from "./assets/1.pdf";
import "@yangxuy/pdf-reader";
import { useRef } from "react";
import React from "react";

function App() {
    const div = useRef<any>();

    return (
        <div className="App" ref={div}>
            {React.createElement("pdf-view", { url: pdf })}
        </div>
    );
}

export default App;
```

### 还未开发的能力
- 错误事件处理
