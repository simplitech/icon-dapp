const {u, sc} = require("@cityofzion/neon-js")
const {NeonInvoker} = require("@cityofzion/neon-dappkit")
const {readFileSync} = require('fs')

// node scripts/update.js <scriptHash> <nefPath> <rpcAddress> <privateKey>
// for testnet, use NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr account
// for mainnet, use NbpFLH7ahiaWa4NraTfnrSAfRqCdjrmkoS account
(async function() {
  const network = JSON.parse(fs.readFileSync("..\\default.neo-express").toString());
  const scriptHash = process.argv[2]
  const nefPath = process.argv[3]
  const rpcAddress = process.argv[4] || 'http://localhost:50012'
  const privateKey = process.argv[5] || network.wallets[0].accounts[0]['private-key']
  const account = new Neon.wallet.Account(privateKey)

  const nef = u.HexString.fromHex(sc.NEF.fromBuffer(readFileSync(nefPath)).serialize(), true)
  const manifest = readFileSync(nefPath.replace('.nef', '.manifest.json')).toString()

  const invoker = await NeonInvoker.init({ rpcAddress, account })
  const resp = await invoker.invokeFunction({
    invocations: [{
      scriptHash,
      operation: 'update',
      args: [
        { type: 'ByteArray', value: nef },
        { type: 'String', value: manifest },
      ]
    }],
    signers: [],
  })

  console.log(resp)
})()