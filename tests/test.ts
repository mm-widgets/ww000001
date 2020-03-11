import Widget from '../src/index';
import '../src/index';

const widget = document.querySelector<Widget>('#widget')!;
widget.addEventListener('mmwe-event', () => {
	// console.info(e.data);
});

const btn = document.querySelector('#test')!;
btn.addEventListener('click', () => {
	widget.method01('mmstudio');
});
