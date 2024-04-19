const { u, sc, wallet } = require("@cityofzion/neon-js");
const { NeonInvoker } = require("@cityofzion/neon-dappkit");
const fs = require('fs');

// node .\sdk\scripts\update.js <scriptHash> <nefPath> <rpcAddress> <privateKey or wif>

// for testnet, use NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr account, example:
  // node .\sdk\scripts\update.js 0x309b6b2e0538fe4095ecc48e81bb4735388432b5 .\contract\icondapp.nef https://testnet1.neo.coz.io:443 <wif>

// for mainnet, use NbpFLH7ahiaWa4NraTfnrSAfRqCdjrmkoS account
(async function () {
  const network = JSON.parse(fs.readFileSync("default.neo-express").toString());
  const scriptHash = process.argv[2]
  const nefPath = process.argv[3]
  const rpcAddress = process.argv[4] || 'http://localhost:50012'
  const privateKey = process.argv[5] || network.wallets[0].accounts[0]['private-key']
  const account = new wallet.Account(privateKey)

  const nef = u.HexString.fromHex(sc.NEF.fromBuffer(fs.readFileSync(nefPath)).serialize(), true).toLittleEndian()
  const manifest = fs.readFileSync(nefPath.replace('.nef', '.manifest.json')).toString()

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