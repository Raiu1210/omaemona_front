# omaemona_front

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## css fix

`node_modules/prismjs/themes/prism.css`

```
/* background: hsla(0, 0%, 100%, .5); */
```


`node_modules/vuetify/dist/vuetify.css`

change like this
```
.v-application code {
  padding: 0.2em 0.0em 0.0em 0.0em;
}
```
