import { emit } from '@mmstudio/on';
import $ from 'jquery';
import 'jstree';

const no = 'fd-w000001';

/**
 * :host表示选中当前组件,使用all:initial;属性,
 * 当外部有css样式要越过shadowDom边界时将该css样式重置为初始值,从而不在影响shaowDom内部的样式.
 * 参考链接https://developers.google.cn/web/fundamentals/web-components/shadowdom#reset,
 */
const tpl = `
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/jstree@3.3.7/dist/themes/default/style.min.css" />
<style>
.${no} {
	width: 100%;
	height: inherit;
	overflow: hidden;
	position: relative;
}
.${no} .no_checkbox > i.jstree-checkbox {
	display:none;
}
:host {
	all: initial;
}
</style>

<div class="${no}">
	<div id="tree"></div>
</div>
`;

interface Item {
	icon: string;
	data: unknown;
	id: string;
	parent: string;
	text: string;
}

export default class Tree extends HTMLElement {
	private jstree: JSTree;
	private m_id!: Map<string, Item>;
	private data!: Item[];
	public constructor() {
		super();
		const dom = this.attachShadow({ mode: 'closed' });
		dom.innerHTML = tpl;
		const checkbox = get_boolean_attribute(this, 'checkbox');
		const auto_open = get_boolean_attribute(this, 'auto-open');
		const auto_close = get_boolean_attribute(this, 'auto-close');
		const state = get_boolean_attribute(this, 'state');
		const dots = get_boolean_attribute(this, 'dots');
		const three_state = !get_boolean_attribute(this, 'disable_undetermined_state');
		const icon = this.getAttribute('icon') as string;
		const tree = dom.getElementById('tree') as HTMLDivElement;
		const data = JSON.parse(this.getAttribute('data') || '[]');
		this.translate_data(data);
		const el = $(tree);
		const plugins = ['search'];
		if (checkbox) {
			plugins.push('checkbox');
		}
		if (state) {
			plugins.push('state');
		}
		el.jstree({
			checkbox: {
				three_state
			},
			core: {
				data: (_obj: unknown, cb: (d: Item[]) => void) => {
					cb(this.data);
				},
				dblclick_toggle: false,
				worker: false	// ! disable worker to avoid error after webpack
			},
			plugins
		});
		this.jstree = el.jstree(true);
		// el.on('click', '.jstree-anchor', (e) => {
		// 	this.jstree.toggle_node(e.target);
		// });
		el.on('activate_node.jstree', (_e, evt_data) => {
			const node = evt_data.node;
			if (node.children.length > 0) {
				if (this.jstree.is_open(node) && auto_close) {
					this.close(node.id);			// 结点是展开的，则进行关闭
				} else if (this.jstree.is_closed(node) && auto_open) {
					this.open(node.id);				// 结点是关闭的，则进行展开
				}
			}
			emit(this, 'fdwe-tree-activate-node', true, true, {
				data: {
					data: node.data,
					id: node.id,
					parent: node.parent,
					parents: node.parents
				}
			});
		});
		el.on('select_node.jstree', (_e, evt_data) => {
			const node = evt_data.node;
			emit(this, 'fdwe-tree-select-node', true, true, {
				data: {
					data: node.data,
					id: node.id,
					parent: node.parent,
					parents: node.parents
				}
			});
		});
		if (icon === null) {
			this.jstree.hide_icons();
		}
		if (!dots) {
			this.jstree.hide_dots();
		}
	}
	public get_data_by_id(id: string) {
		const item = this.m_id.get(id);
		if (item) {
			return item.data;
		}
		return undefined;
	}
	public get_node_by_id(id: string) {
		return this.jstree.get_node(id);
	}
	public search(str: string) {
		return this.jstree.search(str);
	}
	public clear_search() {
		return this.jstree.clear_search();
	}
	public close_all() {
		return this.jstree.close_all();
	}
	public open_all() {
		return this.jstree.open_all();
	}
	public open(id: string) {
		return this.jstree.open_node(id);
	}
	public close(id: string) {
		return this.jstree.close_node(id);
	}
	public get_checked() {
		return this.jstree.get_checked(true).map((it) => {
			return it.data;
		});
	}
	public get_top_checked() {
		return this.jstree.get_top_checked(false) as string[];
	}
	public get_bottom_checked() {
		return this.jstree.get_bottom_checked(false) as string[];
	}
	public check_all() {
		this.jstree.check_all();
	}
	public uncheck_all() {
		this.jstree.uncheck_all();
	}
	public check_node(id: string | string[]) {
		this.jstree.check_node(id, undefined);
	}
	public uncheck_node(id: string | string[]) {
		this.jstree.uncheck_node(id, undefined);
	}
	public is_checked(id: string) {
		this.jstree.is_checked(id);
	}
	public select_node(id: string | string[]) {
		return this.jstree.select_node(id);
	}
	public deselect_node(id: string | string[]) {
		return this.jstree.deselect_node(id);
	}
	public select_all() {
		return this.jstree.select_all();
	}
	public deselect_all() {
		return this.jstree.deselect_all();
	}
	public is_selected(id: string) {
		return this.jstree.is_selected(id);
	}
	public get_selected() {
		return this.jstree.get_selected() as string[];
	}
	public get_top_selected() {
		return this.jstree.get_top_selected() as string[];
	}
	public get_bottom_selected() {
		return this.jstree.get_bottom_selected() as string[];
	}
	public disable_checkbox(id: string | string[]) {
		return this.jstree.disable_checkbox(id);
	}
	public enable_checkbox(id: string | string[]) {
		return this.jstree.enable_checkbox(id);
	}
	/**
	 * get the path to a node, either consisting of node texts, or of node IDs
	 * @param id nodeid
	 * @param ids if set to true build the path using ID, otherwise node text is used
	 */
	public get_path(id: string | string[], ids: boolean) {
		return this.jstree.get_path(id, '/', ids);
	}
	public get_parent(id: string) {
		return this.jstree.get_parent(id);
	}
	public get_children_dom(id: string) {
		return this.jstree.get_children_dom(id);
	}
	public is_parent(id: string) {
		return this.jstree.is_parent(id);
	}
	public is_leaf(id: string) {
		return this.jstree.is_leaf(id);
	}
	public is_node_open(id: string) {
		return this.jstree.is_open(id);
	}
	public is_node_closed(id: string) {
		return this.jstree.is_closed(id);
	}
	public is_disabled(id: string) {
		return this.jstree.is_disabled(id);
	}
	public enable_node(id: string) {
		return this.jstree.enable_node(id);
	}
	public disable_node(id: string) {
		return this.jstree.disable_node(id);
	}
	public is_hidden(id: string) {
		return this.jstree.is_hidden(id);
	}
	public hide_node(id: string, skip_redraw: boolean) {
		return this.jstree.hide_node(id, skip_redraw);
	}
	public show_node(id: string, skip_redraw: boolean) {
		return this.jstree.show_node(id, skip_redraw);
	}
	public hide_all(skip_redraw: boolean) {
		return this.jstree.hide_all(skip_redraw);
	}
	public show_all(skip_redraw: boolean) {
		return this.jstree.show_all(skip_redraw);
	}
	public get_text(id: string) {
		return this.jstree.get_text(id);
	}
	public set_text(id: string | string[], text: string) {
		return this.jstree.rename_node(id, text);
	}
	public get_json(id: string) {
		return this.jstree.get_json(id, undefined, false);
	}
	public delete_node(id: string) {
		return this.jstree.delete_node(id);
	}
	public hide_icon(id: string) {
		return this.jstree.hide_icon(id);
	}
	public show_icon(id: string) {
		return this.jstree.show_icon(id);
	}
	private translate_data(value: { [field: string]: string; }[]) {
		const icon = this.getAttribute('icon') as string;
		const id_field = this.getAttribute('id-field') || 'id';
		const pid_field = this.getAttribute('pid-field') || 'pid';
		const text_field = this.getAttribute('text-field') || 'text';
		const title_field = this.getAttribute('title-field') || 'title';
		const icon_field = this.getAttribute('icon-field') || 'icon';
		const m_id = this.m_id = new Map<string, Item>();
		this.data = value.map((it) => {
			const item = {
				a_attr: {
					class: it.no_checkbox ? 'no_checkbox' : '',
					title: it[title_field] || it[text_field]
				},
				data: it,
				icon: it[icon_field] || icon,
				id: it[id_field].toString(),
				parent: it[pid_field].toString(),
				text: it[text_field]
			} as Item;
			m_id.set(item.id, item);
			return item;
		}).map((it) => {
			if (m_id.has(it.parent)) {
				return { ...it };
			}
			return { ...it, parent: '#' };
		});
		return this.data;
	}
	public set_data(value: { [field: string]: string; }[]) {
		// reset local variables
		this.translate_data(value);
		this.jstree.refresh(false, false);
	}
}

if (!window.customElements.get(no)) {
	window.customElements.define(no, Tree);
}

function get_boolean_attribute(node: HTMLElement, attribute: string) {
	if (node.hasAttribute(attribute)) {
		const value = node.getAttribute(attribute);
		if (value) {
			return value.toLocaleLowerCase() !== 'false';
		}
		return true;

	}
	return false;

}
