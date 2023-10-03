import * as sdk from '../dist'
import fs from 'fs'
import { wallet } from '@cityofzion/neon-core'
import { txDidComplete } from './helpers'
import { NeonParser } from '@cityofzion/neon-parser'
import { NeonInvoker } from '@cityofzion/neon-invoker'


// node scripts/set_icons.js <scriptHash> <rpcAddress> <privateKey>
// for testnet, use NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr account
// for mainnet, use NbpFLH7ahiaWa4NraTfnrSAfRqCdjrmkoS account
(async function () {
  const network = JSON.parse(fs.readFileSync("..\\default.neo-express").toString());
  const scriptHash = process.argv[2]
  const rpcAddress = process.argv[3] || 'http://localhost:50012'
  const privateKey = process.argv[4] || network.wallets[0].accounts[0]['private-key']
  const account = new wallet.Account(privateKey)

    const iconDapp = new sdk.IconDapp({
        scriptHash,
        invoker: await NeonInvoker.init(rpcAddress, account),
        parser: NeonParser,
    })

    console.log('Creating the invocations, to send a single transaction instead of many.')
    const invocations = []

    // Adding the properties
    invocations.push(sdk.IconDapp.buildAddPropertyInvocation(
        scriptHash,
        NeonParser,
        {
            propertyName: "icon/25x25",
            description: "Icon with a 25x25 pixels resolution"
        }
    ))
    invocations.push(sdk.IconDapp.buildAddPropertyInvocation(
        scriptHash,
        NeonParser,
        {
            propertyName: "icon/288x288",
            description: "Icon with a 288x288 pixels resolution"
        }
    ))

    // Set NEO 25x25 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/Neo.png',
        }
    ))
    // Set NEO 288x288 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/Neo.png',
        }
    ))

    // Set GAS 25x25 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/GAS.png',
        }
    ))
    // Set GAS 288x288 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/GAS.png',
        }
    ))

    // Set FLM 25x25 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/Flamingo_Finance.png',
        }
    ))
    // Set FLM 288x288 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xf0151f528127558851b39c2cd8aa47da7418ab28',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/Flamingo_Finance.png',
        }
    ))

    // Set Burger 25x25 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/NeoBurger.png',
        }
    ))
    // Set Burger 288x288 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0x48c40d4666f93408be1bef038b6722404d9a4c2a',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/NeoBurger.png',
        }
    ))

    // Set GrantSharesGov 25x25 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
            propertyName: 'icon/25x25',
            value: 'https://icon-dapp.s3.amazonaws.com/25x25/GrantShares.png',
        }
    ))
    // Set GrantSharesGov 288x288 icon
    invocations.push(sdk.IconDapp.buildSetMetaDataInvocation(
        scriptHash,
        NeonParser,
        {
            scriptHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
            propertyName: 'icon/288x288',
            value: 'https://icon-dapp.s3.amazonaws.com/288x288/GrantShares.png',
        }
    ))

    // Set GrantSharesTreasury as child of GrantSharesGov
    invocations.push(sdk.IconDapp.buildSetContractParentInvocation(
        scriptHash,
        {
            childHash: '0x6276c1e3a68280bc6c9c00df755fb691be1162ef',
            parentHash: '0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9',
        }
    ))

    const txid = await iconDapp.invokeFunction({ invocations, signers: [] })

    console.log(`Setting metadata transaction ID: ${txid}`)

    const result = await txDidComplete(network, txid, true)

    console.log(result)
})()
