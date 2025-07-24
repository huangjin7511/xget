/**
 * Configuration object for different platform URLs and path transformations
 * @type {Object.<string, {base: string, transform: function(string): string}>}
 */
export const PLATFORMS = {
	/** @type {{base: string, transform: function(string): string}} GitHub configuration */
	gh: {
		base: "https://github.com",
		transform: (path) => path.replace(/^\/gh\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} GitLab configuration */
	gl: {
		base: "https://gitlab.com",
		transform: (path) => path.replace(/^\/gl\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} Hugging Face configuration */
	hf: {
		base: "https://huggingface.co",
		transform: (path) => path.replace(/^\/hf\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} npm registry configuration */
	npm: {
		base: "https://registry.npmjs.org",
		transform: (path) => path.replace(/^\/npm\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} PyPI registry configuration */
	pypi: {
		base: "https://pypi.org",
		transform: (path) => path.replace(/^\/pypi\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} PyPI files configuration */
	"pypi-files": {
		base: "https://files.pythonhosted.org",
		transform: (path) => path.replace(/^\/pypi\/files\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} conda default channels configuration */
	conda: {
		base: "https://repo.anaconda.com",
		transform: (path) => path.replace(/^\/conda\//, "/"),
	},
	/** @type {{base: string, transform: function(string): string}} conda community channels configuration */
	"conda-community": {
		base: "https://conda.anaconda.org",
		transform: (path) => path.replace(/^\/conda\/community\//, "/"),
	},
	// /** @type {{base: string, transform: function(string): string}} All platforms */
	// link: {
	// 	base: "https://",
	// 	transform: (path) => path.replace(/^\/link\//, "/"),
	// },
};
