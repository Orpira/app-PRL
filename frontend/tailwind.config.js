export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
		},
		extend: {
			colors: {
				background: {
					DEFAULT: '#181A20',
					light: '#FFFFFF',
				},
				card: {
					DEFAULT: '#23262F',
					light: '#F8F9FB',
				},
				accent: {
					DEFAULT: '#4F8CFF',
				},
				primary: {
					DEFAULT: '#181A20',
					light: '#23262F',
				},
				muted: {
					DEFAULT: '#A3A6B1',
				},
				border: {
					DEFAULT: 'rgba(0,0,0,0.12)',
					light: 'rgba(0,0,0,0.06)',
				},
			},
		},
	},
	plugins: [],
};
