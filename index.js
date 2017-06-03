const tv4 = require('tv4')

const CODES = Object.keys(tv4.errorCodes).reduce((res, item) => {
    const key = tv4.errorCodes[item] * 1
    res[key] = item
    return res
}, {})

module.exports = (value, schema, messages) => {
    const message = 'Техническая ошибка'
    const validation = tv4.validateMultiple(value, schema)
    const valid = validation.valid
    const errors = validation.errors.map(item => {
        const dataPath = item.dataPath ?
            item.dataPath.slice(1).split('/').filter(i => i) : []
        const schemaPath = item.schemaPath ?
            item.schemaPath.slice(1).split('/').filter(i => i) : []
        return {
            params: item.params,
            code: CODES[item.code],
            dataPath: dataPath,
            schemaPath: schemaPath,
            message: schemaPath.reduce((res, item) => {
                if (res === message) return message
                return res[item] || message
            }, messages || {})
        }
    })

    return { valid, errors }
}
