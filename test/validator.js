const assert = require('assert')
const validator = require('../index')

const schema = {
    type: 'object',
    required: [
        'name',
        'email'
    ],
    properties: {
        name: {
            type: 'string',
            maxLength: 20,
            minLength: 1
        },
        email: {
            type: 'string',
            maxLength: 40,
            minLength: 3,
            pattern: '^.+@.+$'
        },
        phone: {
            type: 'string',
            enum: ['111', '222']
        }
    }
}

const errors = {
    properties: {
        name: {
            maxLength: 'Слишком длинное имя',
            minLength: 'Поле обязательно'
        },
        email: {
            maxLength: 'Слишком длинный e-mail',
            minLength: 'E-mail некорректен',
            pattern: 'E-mail некорректен'
        },
        phone: {
            type: 'Возможные варианты "111" или "222"'
        }
    }
}

describe('Validator', () => {

    it('should pass correctly', () => {
        const value = {
            name: 'User Name',
            email: 'username@email.com',
            phone: '111'
        }
        const result = validator(value, schema, errors)
        assert.deepEqual(result.valid, true)
        assert.deepEqual(result.errors, [])
    })

    it('should return error OBJECT_REQUIRED', () => {
        const value = {
            email: 'username@email.com',
            phone: '111'
        }
        const result = validator(value, schema, errors)
        assert.deepEqual(result.valid, false)
        assert.deepEqual(result.errors, [{
            "code": "OBJECT_REQUIRED",
            "dataPath": [],
            "message": "Техническая ошибка",
            "params": {
                "key": "name"
            },
            "schemaPath": ["required", "0"]
        }])
    })

    it('should return errors STRING_LENGTH_LONG, ENUM_MISMATCH', () => {
        const value = {
            name: 'User Name User Name User Name User Name User Name User Name',
            email: 'username@email.com',
            phone: '444'
        }
        const result = validator(value, schema, errors)
        assert.deepEqual(result.valid, false)
        assert.deepEqual(result.errors, [
            {
                params: { length: 59, maximum: 20 },
                code: 'STRING_LENGTH_LONG',
                dataPath: [ 'name' ],
                schemaPath: [ 'properties', 'name', 'maxLength' ],
                message: 'Слишком длинное имя'
            },
            {
                params: { value: '"444"' },
                code: 'ENUM_MISMATCH',
                dataPath: [ 'phone' ],
                schemaPath: [ 'properties', 'phone', 'type' ],
                message: 'Возможные варианты "111" или "222"'
            }
        ])
    })

})
