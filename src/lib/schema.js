'use strict'

module.exports = function (data) {
  const schema = {}

  if (data.version) delete data.version

  for (const key of Object.keys(data)) {
    const fields = data[key].fields
    if (fields.id) delete fields.id

    for (const fieldKey of Object.keys(fields)) {
      const { sqlType } = fields[fieldKey]

      if (sqlType === 'text' || sqlType === 'varchar') {
        schema[fieldKey] = 'string'
      } else if (sqlType === 'integer' || sqlType === 'bigint' || sqlType === 'smallint') {
        schema[fieldKey] = 'number'
      } else if (sqlType === 'boolean') {
        schema[fieldKey] = 'boolean'
      }
    }
  }
  return schema
}
