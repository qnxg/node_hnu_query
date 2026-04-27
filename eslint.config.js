import antfu from "@antfu/eslint-config"

export default antfu({
  type: "lib",

  stylistic: {
    semi: false,
    quotes: "double",
  },

  typescript: true,

  rules: {
    "node/prefer-global/buffer": "off",
  },
})
