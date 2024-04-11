# IconDapp
IconDapp is a hub of icons forall Dapps on Neo3.

Learn more about IconDapp at [icondapp.io](https://icondapp.io)

---

IconDapp offers a comprehensive SDK designed to simplify your interactions with its SmartContract. This powerful tool handles all necessary conversions and seamlessly integrates with WalletConnect, ensuring a smooth user experience.

However, if you prefer a more direct approach, checkout ["Direct RPC Calls guide"](DIRECT_RPC_CALLS.md) to learn about making a quick RPC Server call to obtain the specific information you're seeking. Let's dive in and enhance your understanding of IconDapp's capabilities.

## Install the SDK
Install the IconDapp, Neon-DappKit, and Neon-DappKit-Types packages:
```bash
npm i @simpli/icondapp @cityofzion/neon-dappkit @cityofzion/neon-dappkit-types
```

## How to initialize the SDK
Import the IconDapp package into your project and create a new instance of the IconDapp class by using a class that implements the Neo3Invoker interface and a class that implements the Neo3Parser interface as parameters.

If your goal is to extract blockchain data or manage transaction signing in your own backend, consider utilizing NeonInvoker and NeonParser from [NeonDappkit](https://github.com/CityOfZion/neon-dappkit/). However, for enabling users to contribute data to the blockchain via your application, [WalletConnect](https://github.com/CityOfZion/wallet-connect-sdk) could be a more suitable choice than NeonInvoker.

Below is an illustration of using NeonInvoker for data retrieval:
```typescript
import { IconDapp } from '@simpli/icondapp'
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'


const createIconDapp = async () => { 
  return new IconDapp({
    scriptHash: IconDapp.MAINNET,
    invoker: await NeonInvoker.init({rpcAddress: 'http://seed1.neo.org:10332'}),
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
  console.log(props)
}
```
Result:
```bash
{
  'icon/25x25': 'Icon with a 25x25 pixels resolution',
  'icon/288x288': 'Icon with a 288x288 pixels resolution'
}
```

### `getMetadata(options: {scriptHash: string})`
Returns an object with the metadata about the icons of a smart contract. If the smart contract is a child it will return an object with 'parent' as a key.
```typescript
const callGetMetadata = async () => {
  const iconDapp = await createIconDapp()
  // Getting the icons of the GAS contract
  const gasIcons = await iconDapp.getMetadata({
    scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf"
  })
  console.log(gasIcons)
}
```
Result:
```bash
{
  'icon/25x25': 'https://icon-dapp.s3.amazonaws.com/25x25/GAS.png',
  'icon/288x288': 'https://icon-dapp.s3.amazonaws.com/288x288/GAS.png'
}
```

### `getMultipleMetadata(options: { contractHashes: string[] })`
Returns an object with the metadata about the icons of multiple smart contracts.
```typescript	
const callGetMultipleMetadata = async () => {
  const iconDapp = await createIconDapp()
  const neoBlockchainTokensIcons = await iconDapp.getMultipleMetadata({
    contractHashes: [
      "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"
    ]
  })
  console.log(neoBlockchainTokensIcons)
}
```
Result:
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
A Dapp is often composed of multiple SmartContracts, so in IconDapp, we group them using the keyword "parent." In short, a Dapp has a single "parent" SmartContract for multiple children. If you require information about a SmartContract's parent, you can utilize the getContractParent method. It's important to note that this method is unnecessary for retrieving an icon associated with a child scripthash; you can still utilize getMetadata for this purpose.
```typescript
const callGetContractParent = async () => {
  const iconDapp = await createIconDapp()
  const resp = await iconDapp.getContractParent({
    // Getting the parent of this contract
    childHash: "0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9"
  })
  console.log(resp)
}
```
Result:
```bash
0x6276c1e3a68280bc6c9c00df755fb691be1162ef
```

### `listIcons(itemsPerRequest: number = 20)`
Returns an AsyncGenerator with all smart contracts, the value of the generator will be a list of objects with the scriptHash and the icons of a smart contract. The length of the list will be less or equal to the value of the itemsPerRequest parameter.
```typescript	
const callListIcons = async () => {
  const iconDapp = await createIconDapp()
  const icons: { scriptHash: string, icons: object }[] = []

  // You can use another value for the itemsPerRequest parameter if you want to
  for await (const iconsPage of iconDapp.listIcons()) {
    icons.push(...iconsPage)
  }
  console.log(icons)
}
```
Result:
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
