# validator

### Instalation
```
npm install --save tvalidator
```

### Usage
```
const validator = require('tvalidator')({
  defaultErrorMessage: 'Unexpected error',
  showErrorCode: true
})

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      maxLength: 10,
      minLength: 1
    }
  }
}

const errors = {
  properties: {
    name: {
      maxLength: 'Name too long'
    }
  }
}

const aRes = validator({ name: 'User Name' }, schema, errors)
console.log(JSON.stringify(aRes, null, 2))
// {
//   "valid": true,
//   "errors": []
// }

const bRes = validator({ name: '12345678901' }, schema, errors)
console.log(JSON.stringify(bRes, null, 2))
// {
//   "valid": false,
//   "errors": [
//     {
//       "params": {
//         "length": 11,
//         "maximum": 10
//       },
//       "code": "STRING_LENGTH_LONG",
//       "dataPath": [
//         "name"
//       ],
//       "schemaPath": [
//         "properties",
//         "name",
//         "maxLength"
//       ],
//       "message": "Name too long"
//     }
//   ]
// }

const cRes = validator({ name: '' }, schema, errors)
console.log(JSON.stringify(cRes, null, 2))
// {
//   "valid": false,
//   "errors": [
//     {
//       "params": {
//         "length": 0,
//         "minimum": 1
//       },
//       "code": "STRING_LENGTH_SHORT",
//       "dataPath": [
//         "name"
//       ],
//       "schemaPath": [
//         "properties",
//         "name",
//         "minLength"
//       ],
//       "message": "Unexpected error (code: STRING_LENGTH_SHORT)"
//     }
//   ]
// }

```
