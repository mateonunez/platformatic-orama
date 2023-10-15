# Platformatic with Orama

The services exposes two routes:

- `/orama/:author` - returns a list of all the posts that matches the `author` query param using [Orama](https://github.com/OramaSearch/orama)
- `/mapper/:author` - returns a list of all the posts that matches the `author` query param using the native [@platformatic/sql-mapper](https://www.npmjs.com/package/@platformatic/sql-mapper)

## Usage

```bash
$ npm install
```

Create a new migration file in `database/migrations/001.do.sql`.

```sql
CREATE TABLE quotes(
  id INTEGER PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL
)
```

```bash
$ npm run platformatic:migrate
$ npm run platformatic:seed
$ npm start
```

# License

[MIT](/LICENSE)
