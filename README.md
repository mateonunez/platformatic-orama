# Platformatic with Lyra

The services exposes two routes:

- `/lyra/:author` - returns a list of all the posts that matches the `author` query param using [Lyra](https://github.com/LyraSearch/lyra)
- `/mapper/:author` - returns a list of all the posts that matches the `author` query param using the native [@platformatic/sql-mapper](https://www.npmjs.com/package/@platformatic/sql-mapper)

## Usage

```bash
$ npm install
$ npm run platformatic:seed
$ npm start
```

# License

[MIT](/LICENSE)
