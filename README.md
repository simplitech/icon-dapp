# IconDapp

## Install the SDK
Install the IconDapp, NeonInvoker, and NeonParser NeonDappkit packages with your desired package manager:
```bash
npm i @simplitech/icon-dapp @cityofzion/neon-invoker@1.3.1 @cityofzion/neon-parser@1.5.2
```

## How to initialize the SDK
Import the IconDapp package into your project and create a new instance of the IconDapp class by using NeonInvoker and NeonParser as parameters:
```typescript
import { IconDapp } from '@simplitech/icon-dapp'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'


const createIconDapp = async (account?: any) => { 
  new IconDapp({
    scriptHash: IconDapp.MAINNET,
    invoker: await NeonInvoker.init('http://seed1.neo.org:10332', account),
    parser: NeonParser,
  })
}
```


## SDK Methods available
After initializing a new IconDapp instance, you can use the following methods to interact with the dapp:

### `getProperties()`
Returns an object with pairs of the name of the property and a description of the icons.
```typescript
const callGetProperties = async () => {
  const iconDapp = await createIconDapp()
  const props = await iconDapp.getProperties()
  console.log(JSON.stringify(props, null, 2))
}
```
```bash
{
  'icon/25x25': 'Icon with a 25x25 pixels resolution',
  'icon/288x288': 'Icon with a 288x288 pixels resolution'
}
```

### `getMetaData(options: {scriptHash: string})`
Returns an object with the metadata about the icons of a smart contract. If the smart contract is a child it will return an object with 'parent' as a key.
```typescript
const callGetMetaData = async () => {
  const iconDapp = await createIconDapp()
  // Getting the icons of the GAS contract
  const resp = await iconDapp.getMetaData({
    scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf"
  })
  console.log(JSON.stringify(resp, null, 2))
}
```
```bash
{
  'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/GAS.png',
  'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/GAS.png'
}
```

### `getMultipleMetaData(options: { contractHashes: string[] })`
Returns an object with the metadata about the icons of multiple smart contracts.
```typescript	
const callGetMultipleMetaData = async () => {
  const iconDapp = await createIconDapp()
  const resp = await iconDapp.getMultipleMetaData({
    contractHashes: [
      "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"
    ]
  })
  console.log(JSON.stringify(resp, null, 2))
}
```
```bash
{
  '0xd2a4cff31913016155e38e474a2c06d08be276cf': {
    'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/GAS.png',
    'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/GAS.png'
  },
  '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5': {
    'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/Neo.png',
    'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/Neo.png'
  }
}
```

### `getContractParent(options: { childHash: string })`
Returns the parent of a smart contract. If there is no parent it will return null.
```typescript
const callGetContractParent = async () => {
  const iconDapp = await createIconDapp()
  const resp = await iconDapp.getContractParent({
    // Getting the parent of this contract
    childHash: "0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9"
  })
  console.log(JSON.stringify(resp, null, 2))
}
```
```bash
0x6276c1e3a68280bc6c9c00df755fb691be1162ef
```

### `listIcons()`
Returns an AsyncGenerator with all smart contracts, the value of the generator will be an object with the scriptHash and the icons of a smart contract. 
```typescript	
const callListIcons = async () => {
  const iconDapp = await createIconDapp()
  const icons: { scriptHash: string, icons: object }[] = []

  for await (const icon of iconDapp.listIcons()) {
    icons.push(icon)
  }
  console.log(icons)
}
```
```bash
[
  {
    scriptHash: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
    icons: {
      'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/Flamingo_Finance.png',
      'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/Flamingo_Finance.png'
    }
  },
  ...
  {
    scriptHash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
    icons: {
      'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/Neo.png',
      'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/Neo.png'
    }
  }
]
```
