
const context = require.context('../assets/icons', false, /\.svg$/);

const icons: Record<string, any> = {};

context.keys().forEach((key) => {
	const imageName = key.replace('./', '').replace('-icon.svg', '');
	icons[imageName] = context(key);
});


export default icons;
