import { rpc, wallet } from '@cityofzion/neon-core'
import fs from 'fs'
import { deployContract, txDidComplete, sleep } from './helpers.js'

const network = JSON.parse(fs.readFileSync("..\\default.neo-express").toString());
const nefPath = process.argv[2] || '..\\contract\\icondapp.nef'
const NODE = process.argv[3] || 'http://localhost:50012'
const PRIVATE_KEY = process.argv[4] || network.wallets[0].accounts[0]['private-key']
const SIGNER = new wallet.Account(PRIVATE_KEY)
const TIME_CONSTANT = process.argv[5] || 15000

const rpcNode = new rpc.RPCClient(NODE)
const getVersionRes = await rpcNode.getVersion().catch(e => { console.log(e) })
const networkMagic = getVersionRes.protocol.network

const txid = await deployContract(NODE, networkMagic, nefPath, SIGNER)
await sleep(TIME_CONSTANT)
await txDidComplete(NODE, txid, true)
