import type {Config} from 'tailwindcss'


export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'accent-red': '#d93427',
        'accent-orange': '#f6894f',
        'accent-orange-bg': '#ffead3',
        'accent-orange-text': '#865a19',
        'accent-yellow-bg': '#fff6ec',
        'accent-latte': '#fff3e5',
        'accent-brown': '#401f10'
      },
      fontFamily: {
        display: ['Lora', 'Noto Sans CJK SC', 'system-ui', 'serif'],
        body: ['Noto Sans CJK SC', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: []
} satisfies Config;
