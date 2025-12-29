import { write, file } from 'bun';
import { icons } from '@phosphor-icons/core';

const VARIANTS = ['bold', 'duotone', 'fill', 'light', 'regular', 'thin'];

for (const variant of VARIANTS) {
	const reexports: string[] = [];

	for (const icon of icons) {
		const path = `./node_modules/@phosphor-icons/core/assets/${variant}/${icon.name}${variant === 'regular' ? '' : '-' + variant}.svg`;
		const svg = (await file(path).text()).split('');
		svg.splice(5, 0, '{...props} ');
		svg.unshift(
			'<script lang="ts">',
			'import { type SVGAttributes } from "svelte/elements";',
			'let props: SVGAttributes = $props();</script>'
		);
		write(`./src/lib/${variant}/${icon.name}.svelte`, svg.join(''));

		reexports.push(`export { default as ${icon.pascal_name} } from './${icon.name}.svelte'`);
	}

	await write(`./src/lib/${variant}/index.js`, reexports.join('\n'));
}

await write('./src/lib/index.ts', 'export * from "./regular"');
