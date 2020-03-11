# 树

<!-- TOC -->

- [1. 注意：](#1-注意)
- [2. Attributes](#2-attributes)
	- [2.1. `data`](#21-data)
	- [2.2. `id-field`](#22-id-field)
	- [2.3. `pid-field`](#23-pid-field)
	- [2.4. `text-field`](#24-text-field)
	- [2.5. `title-field`](#25-title-field)
	- [2.6. `icon`](#26-icon)
	- [2.7. `icon-field`](#27-icon-field)
	- [2.8. `dots`](#28-dots)
	- [2.9. `checkbox`](#29-checkbox)
	- [2.10. `disable_undetermined_state`](#210-disable_undetermined_state)
	- [2.11. `state`](#211-state)
	- [2.12. `auto-open`](#212-auto-open)
	- [2.13. `auto-close`](#213-auto-close)
- [3. Methods](#3-methods)
	- [3.1. `get_data_by_id`](#31-get_data_by_id)
	- [3.2. `get_node_by_id`](#32-get_node_by_id)
	- [3.3. `search`](#33-search)
	- [3.4. `clear_search`](#34-clear_search)
	- [3.5. `close_all`](#35-close_all)
	- [3.6. `open_all`](#36-open_all)
	- [3.7. `open`](#37-open)
	- [3.8. `close`](#38-close)
	- [3.9. `get_checked`](#39-get_checked)
	- [3.10. `check_all`](#310-check_all)
	- [3.11. `uncheck_all`](#311-uncheck_all)
	- [3.12. `check_node`](#312-check_node)
	- [3.13. `set_data`](#313-set_data)
- [4. Events](#4-events)
	- [4.1. 事件绑定示例](#41-事件绑定示例)
	- [4.2. `mmwe-tree-select-node`](#42-mmwe-tree-select-node)
	- [4.3. `mmwe-tree-activate-node`](#43-mmwe-tree-activate-node)

<!-- /TOC -->

## 1. 注意：

需要在gulpfile.js文件的webpack命令中添加以下代码:

```js
...
module:{
	...
},
plugins: [
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery"
	})
]
}, webpack))
...
```

## 2. Attributes

### 2.1. `data`

必要属性，必须为一个数组，并且至少有三个字段

```html
<mm-000001 checkbox dots icon="./images/45_70x70.jpg" id-field="no" text-field="name" pid-field="parent" title-field="alias" icon-field="img" data='[{"no":1,"parent":"root","name":"1", "alias":"title"},{"no":2,"parent":"0","name":"2"},{"no":"11","parent":"1","name":"11"},{"no":"12","parent":"1","name":"12", "img":"https://avatars1.githubusercontent.com/u/15901911?s=40&v=4"},{"no":"111","parent":"11","name":"111"},{"no":"112","parent":"11","name":"112"},{"no":"211","parent":"2","name":"211"}]'></mm-000001>
```

如需刷新数据，请使用脚本重新设置data属性

```ts
widget.setAttribute('data', '[{"no":1,"parent":"root","name":"1", "alias":"ddddddddddd"},{"no":2,"parent":"0","name":"2"},{"no":"11","parent":"1","name":"444"},{"no":"12","parent":"1","name":"12"},{"no":"111","parent":"11","name":"111", "no_checkbox": true},{"no":"112","parent":"11","name":"112", "no_checkbox": true},{"no":"211","parent":"2","name":"211", "no_checkbox": true}]');
```

### 2.2. `id-field`

提供的数据中可以作为`id`的字段名,该字段用来标识每一个树结点。默认值为`id`

### 2.3. `pid-field`

提供的数据中可以作为`pid`的字段名，该字段用来标识该结点的父结点。默认值为`pid`

### 2.4. `text-field`

提供的数据中可以作为`text`的字段名，该字段用来在树结点上显示。默认值为`text`

### 2.5. `title-field`

提供的数据中可以作为`title`的字段名，该字段用来在树结点上标示`title`属性，鼠标在上面的时候弹出提示信息，当需要显示更多内容的时候有用。默认值为`title`

### 2.6. `icon`

提供一个图片地址，用来替换默认图标显示,如果未定义属性值或属性值为字符串，则使用默认图标显示

### 2.7. `icon-field`

提供的数据中可以作为`icon`的字段名，该字段用来在树结点上显示图标。默认值为`icon`。只有设置了`icon`属性时起使用

### 2.8. `dots`

是否显示结点左边的虚线

### 2.9. `checkbox`

是否显示复选框,如果显示复选框的话，点击节点不会展开或关闭

### 2.10. `disable_undetermined_state`

是否禁用三态复选框，注意：`checkbox`为true时才有效

### 2.11. `state`

是否保存状态

### 2.12. `auto-open`

点击结点是否进行展开

### 2.13. `auto-close`

点击结点是否进行关闭

## 3. Methods

### 3.1. `get_data_by_id`

通过id获取数据

### 3.2. `get_node_by_id`

通过结点id获取结点对象

### 3.3. `search`

在树中进行搜索

### 3.4. `clear_search`

解除搜索状态，还原完整树结点显示

### 3.5. `close_all`

折叠全部结点

### 3.6. `open_all`

打开全部结点

### 3.7. `open`

打开某个结点

### 3.8. `close`

折叠某个结点

### 3.9. `get_checked`

获取选中的数据

### 3.10. `check_all`

全部选中

### 3.11. `uncheck_all`

全部不选

### 3.12. `check_node`

选中一个或多个结点

### 3.13. `set_data`

重置数据

## 4. Events

### 4.1. 事件绑定示例

```html
<mm-000001 data-feidao-actions="mmwe-tree-select-node:a001"></mm-000001>
```

### 4.2. `mmwe-tree-select-node`

参数属性`data`中数据格式如下

```ts
{
	data: any;
	id: string;
	parent: string;
	parents: string[];
}
```

**注意**此事件在初始化时，如果该控件不是第一次使用，也会被调用，如果不希望该事件在初始化时被调用，请使用`mmwe-tree-activate-node`

### 4.3. `mmwe-tree-activate-node`

参数属性`data`中数据格式如下

```ts
{
	data: any;
	id: string;
	parent: string;
	parents: string[];
}
```
