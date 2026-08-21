---
title: 'Data'
weight: 700
---

Data 目錄只儲存三種檔案：TOML, YAML, JSON。這個目錄的特色是在 Hugo 啟動後，該目錄的內容就會被讀取到 Hugo 記憶體中直到構建結束，中間不會被清除。因此，如果有很大、不被多頁面共用的結構性文件，則應該放在 `assets` 目錄中，因為 `assets` 裡面的內容處理完成後，佔用的記憶體會被 GC 回收。

Data 使用請見[官方文檔](https://gohugo.io/content-management/data-sources/)。
