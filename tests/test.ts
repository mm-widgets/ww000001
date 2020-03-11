import Widget from '../src/index';
import '../src/index';

const widget = document.querySelector<Widget>('#widget')!;
widget.addEventListener('mmwe-tree-select-node', () => {
	// console.info(e.data);
});

widget.addEventListener('mmwe-tree-activate-node', (e) => {
	window.console.info(e);
});

const btn = document.querySelector('#test')!;
btn.addEventListener('click', () => {
	// console.log(widget.get_checked());
	// widget.check_all();
	// widget.uncheck_all();
	// widget.check_node(['11', 2]);
	// widget.close_all();
	// widget.search('444', true, true, "", false, true);
	// widget.hide_checkbox(2);
	widget.set_data([{ "no": 1, "parent": "root", "name": "1", "alias": "ddddddddddd" }, { "no": 2, "parent": "0", "name": "2" }, { "no": "11", "parent": "1", "name": "444" }, { "no": "12", "parent": "1", "name": "12" }, { "no": "111", "parent": "11", "name": "111", "no_checkbox": true }, { "no": "112", "parent": "11", "name": "112", "no_checkbox": true }, { "no": "211", "parent": "2", "name": "211", "no_checkbox": true }]);
});

