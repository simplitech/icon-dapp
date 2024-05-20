import {wallet, u, sc} from '@cityofzion/neon-core'
import fs from 'fs'
import assert from 'assert'
import {IconDapp} from '../src'
import {exec as _exec, spawn} from 'child_process'
import {afterEach} from 'mocha'
import * as util from 'util'
import * as path from 'path'
import { NeonInvoker, NeonParser, NeonEventListener } from '@cityofzion/neon-dappkit'

describe('Basic IconDapp Test Suite', function () {
  this.timeout(60000)
  let scriptHash: string
  let wallets: any
  const TIME_CONSTANT = 2500

  const exec = util.promisify(_exec)
  const wait = util.promisify(setTimeout)

  const neoEventListener = new NeonEventListener('http://127.0.0.1:50012')
  const testsDirPath = __dirname
  const neoXpInstancePath = path.join(testsDirPath, '../../default.neo-express')

  const getSdk = async (account?: any) => {
    return new IconDapp({
      scriptHash,
      invoker: await NeonInvoker.init({rpcAddress: 'http://127.0.0.1:50012', account}),
      parser: NeonParser,
    })
  }

  beforeEach(async function () {
    const neoXpCheckpointPath = path.join(testsDirPath, '../../postSetup.neoxp-checkpoint')
    const neoXpBatchPath = path.join(testsDirPath, './batch_files/initialize.batch')

    await exec(`neoxp checkpoint restore -i ${neoXpInstancePath} -f ${neoXpCheckpointPath}`)

    await exec(`neoxp batch -i ${neoXpInstancePath} ${neoXpBatchPath}`)
    const {stdout} = await exec(`neoxp contract get "IconDapp" -i ${neoXpInstancePath}`)

    const neoxpContract = JSON.parse(stdout)[0]
    scriptHash = neoxpContract.hash
    spawn('neoxp', ['run', '-i', neoXpInstancePath, '-s', '1'], {})
    await wait(TIME_CONSTANT)

    const network = JSON.parse(fs.readFileSync(neoXpInstancePath).toString())
    
    wallets = network.wallets.map((walletObj: any) => ({
      ...walletObj,
      account: new wallet.Account(walletObj.accounts[0]['private-key']),
    }))

    return true
  })

  afterEach('Tear down', async function () {
    await exec(`neoxp stop -i ${neoXpInstancePath}`)
    return true
  })

  it('Tests getName', async () => {
    const iconDapp = await getSdk()

    const resp = await iconDapp.name()
    assert.equal(resp, 'IconDapp')
  })

  it('Tests getOwner before being set', async () => {
    const iconDapp = await getSdk()

    const resp = await iconDapp.getOwner()

    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    assert.equal(resp, `0x${owner.account.scriptHash}`)
  })

  it('Tests testAddProperty', async () => {
    const iconDapp = await getSdk()
    await assert.rejects(
      async () => await iconDapp.testAddProperty({propertyName: 'prop1', description: 'description1'}),
      /No authorization/
    )
  })

  it('Tests testUpdateProperty', async () => {
    const iconDapp = await getSdk()
    await assert.rejects(
      async () => await iconDapp.testUpdateProperty({propertyName: 'prop1', description: 'description1'}),
      /No authorization/
    )
  })

  it('Tests getProperties empty', async () => {
    const iconDapp = await getSdk()
    const resp = await iconDapp.getProperties()
    assert(Object.keys(resp).length === 2)  // icon/25x25 and icon/288x288
  })

  it('Tests addProperties and getProperties', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    const txid = await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    assert(txid.length > 0)
    await wait(1200)

    const resp = await iconDapp.getProperties()
    assert.equal(resp.prop1, 'description1')
  })

  it('Tests addProperty length validation', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'a'.repeat(31),
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be less than or equals to 30'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: '',
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be greater than 0'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'prop1',
        description: 'a'.repeat(255),
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be less than or equals to 254'
    )

    await assert.rejects(
      async () => await iconDapp.addProperty({
        propertyName: 'prop1',
        description: '',
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be greater than 0'
    )

    // testing max length possible
    await iconDapp.addProperty({
      propertyName: 'a'.repeat(30),
      description: 'a'.repeat(254),
    })

    // testing min length possible
    await iconDapp.addProperty({
      propertyName: 'a',
      description: 'a',
    })
  })

  it('Tests testUpdateProperty with property not set', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(
      async () => await iconDapp.updateProperty({propertyName: 'prop2', description: 'description2'}),
      /Invalid property/
    )
  })

  it('Tests updateProperty with invalid length of strings', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'a'.repeat(31),
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be less than or equals to 30'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: '',
        description: 'description1',
      }),
      /Length of propertyName is incorrect, it should be between 1 and 30$/,
      'Property name should be greater than 0'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'prop1',
        description: 'a'.repeat(255),
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be less than or equals to 254'
    )

    await assert.rejects(
      async () => await iconDapp.updateProperty({
        propertyName: 'prop1',
        description: '',
      }),
      /Length of description is incorrect, it should be between 1 and 254$/,
      'Description should be greater than 0'
    )

  })

  it('Tests addProperty, updateProperty and getProperties', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    const txid1 = await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    assert(txid1.length > 0)
    await wait(1200)

    const txid2 = await iconDapp.updateProperty({
      propertyName: 'prop1',
      description: 'updated description',
    })
    assert(txid2.length > 0)
    await wait(1200)

    const resp = await iconDapp.getProperties()
    assert.equal(resp.prop1, 'updated description')
  })

  it('Tests testSetMetadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(async () => await iconDapp.testSetMetadata({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    }),
      /Undefined property name/)

    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappUser = await getSdk(user.account)
    await assert.rejects(async () => await iconDappUser.testSetMetadata({
      owner: user.account.scriptHash,
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    }),
      /No authorization/)  
  })

  it('Tests addProperties and testSetMetadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    let resp = await iconDapp.testSetMetadata({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })
    assert.equal(resp, true)

    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappUser = await getSdk(user.account)
    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash
    resp = await iconDappUser.testSetMetadata(
      {
        owner: user.account.scriptHash,
        scriptHash: contractScriptHash,
        propertyName: 'prop1',
        value: 'https://www.google.com/',
      },
      [
        { account: user.account.scriptHash, scopes: "Global" },
        { account: contractScriptHash, scopes: "Global" }
      ]
    )
    assert.equal(resp, true)
  })

  it('Tests addProperties, setMetadata and getMetadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const txid = await iconDapp.setMetadata({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })
    assert(txid.length > 0)
    await wait(1200)

    const resp = await iconDapp.getMetadata({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
    })

    assert.equal(resp.prop1, 'https://www.google.com/')

    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappUser = await getSdk(user.account)
    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash
    const txid2 = await iconDappUser.setMetadata(
      {
        owner: user.account.scriptHash,
        scriptHash: contractScriptHash,
        propertyName: 'prop1',
        value: 'https://www.youtube.com/',
      },
      [
        { account: user.account.scriptHash, scopes: "Global" },
        { account: contractScriptHash, scopes: "Global" }
      ]
    )
    assert(txid2.length > 0)
    await wait(1200)

    const resp2 = await iconDapp.getMetadata({
      scriptHash: contractScriptHash,
    })

    assert.equal(resp2.prop1, 'https://www.youtube.com/')

    await assert.rejects(async () => await iconDappUser.setMetadata(
      {
        owner: user.account.scriptHash,
        scriptHash: contractScriptHash,
        propertyName: 'prop1',
        value: 'https://www.youtube.com/',
      },
      [
        { account: user.account.scriptHash, scopes: "Global" },
        { account: contractScriptHash, scopes: "Global" }
      ]
    ),
      /Owner already was set/)    
  })

  it('Tests changing contract ownership of a contract that already has ownership when setting metadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')

    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappUser = await getSdk(user.account)
    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash

    await iconDappUser.setOwnership({
      scriptHash: contractScriptHash,
      contractOwner: user.account.scriptHash,
    }, [
      { account: user.account.scriptHash, scopes: "Global" },
      { account: contractScriptHash, scopes: "Global" }
    ])
    await wait(1200)

    const firstOwner = await iconDapp.getContractOwner({scriptHash: contractScriptHash})
    assert.equal(firstOwner.slice(2), user.account.scriptHash)

    const otherUser = wallets.find((wallet: any) => wallet.name === 'otherUser')
    await iconDapp.setMetadata(
      {
        owner: otherUser.account.scriptHash,
        scriptHash: contractScriptHash,
        propertyName: 'prop1',
        value: 'https://www.youtube.com/',
      }
    )
    await wait(1200)

    const secondOwner = await iconDapp.getContractOwner({scriptHash: contractScriptHash})
    assert.equal(secondOwner.slice(2), otherUser.account.scriptHash)
  })

  it('Tests setMetadata invalid length',
  async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    
    await assert.rejects( 
      async() => await iconDapp.setMetadata({
        scriptHash: '0x1234567890123456789012345678901234567890',
        propertyName: 'icon/25x25',
        value: 'a'.repeat(390),
      }),
      /Length of value is incorrect, it should be between 1 and 389$/,
      'Value should be less than or equals to 389'
    )
    
    await assert.rejects( 
      async() => await iconDapp.setMetadata({
        scriptHash: '0x1234567890123456789012345678901234567890',
        propertyName: 'icon/25x25',
        value: '',
      }),
      /Length of value is incorrect, it should be between 1 and 389$/,
      'Value should be greater than 0'
    )
  })

  it('Tests getMultipleMetadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await iconDapp.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const txid1 = await iconDapp.setMetadata({
      scriptHash: '0x14d91cd393bc06c571b966df1cc59c0115bdb59c',
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })
    const txid2 = await iconDapp.setMetadata({
      scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
      propertyName: 'prop1',
      value: 'https://www.reddit.com/',
    })
    assert(txid1.length > 0)
    assert(txid2.length > 0)
    await wait(1200)

    const resp: any = await iconDapp.getMultipleMetadata({
      contractHashes: ['0x14d91cd393bc06c571b966df1cc59c0115bdb59c', '0xd2a4cff31913016155e38e474a2c06d08be276cf']
    })

    assert.equal(resp['0x14d91cd393bc06c571b966df1cc59c0115bdb59c'].prop1, 'https://www.google.com/')
    assert.equal(resp['0xd2a4cff31913016155e38e474a2c06d08be276cf'].prop1, 'https://www.reddit.com/')
  })

  it('Tests testSetContractParent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    const resp = await iconDapp.testSetContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      parentHash: '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b',
    })

    assert.equal(resp, true)
  })

  it('Tests setContractParent and getContractParent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    const txid = await iconDapp.setContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      parentHash: '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b',
    })
    assert(txid.length > 0)
    await wait(1200)

    const resp = await iconDapp.getContractParent({
      childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
    })

    assert.equal(resp, '0xcc5e4edd9f5f8dba8bb65734541df7a1c081c67b')
  })

  it('Tests setContractParent with same hash for child and parent', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    await assert.rejects(
      async () => await iconDapp.setContractParent({
        childHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
        parentHash: '0x49cf4e5378ffcd4dec034fd98a174c5491e395e2',
      }),
      /can't set a contract as its own parent$/
    )
  })

  it('Tests testSetOwnership', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappForOwner = await getSdk(owner.account)
    const iconDappForUser = await getSdk(user.account)

    await iconDappForOwner.addProperty({
      propertyName: 'prop1',
      description: 'description1',
    })
    await wait(1200)

    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const {hash} = JSON.parse(stdout)[0]

    await iconDappForUser.setOwnership({
      scriptHash: hash,
      contractOwner: user.account.scriptHash,
    }, [
      {
        scopes: 'CalledByEntry',
        account: user.account.scriptHash
      },
      {
        scopes: 'CalledByEntry',
        account: hash
      },
    ])
    await wait(1200)

    const resp = await iconDappForUser.testSetMetadata({
      scriptHash: hash,
      propertyName: 'prop1',
      value: 'https://www.google.com/',
    })

    assert.equal(resp, true)
  })

  it('Tests setOwnership', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const userOwner = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappOwner = await getSdk(owner.account)
    const iconDappUser = await getSdk(userOwner.account)
    const propertyName = 'prop1'
    const value = 'https://www.google.com'

    const {stdout} = await exec(`neoxp contract get "ownership" -i ${neoXpInstancePath}`)
    const notverifiableScriptHash = JSON.parse(stdout)[0].hash

    await iconDappOwner.addProperty({
      propertyName,
      description: 'description1',
    })
    await wait(1200)

    await assert.rejects( 
      async () => await iconDappUser.setMetadata({
        scriptHash: notverifiableScriptHash,
        propertyName,
        value
      }),
      /No authorization$/,
      'User can\'t change metadata if he is not the owner'
    )
    await wait(1200)

    // making sure no value was saved
    let contractMetadata = await iconDappUser.getMetadata({scriptHash: notverifiableScriptHash})
    assert(contractMetadata[propertyName] === undefined, 'Property value should not have been added')
    
    // user is claiming ownership of the smart contract they deployed, 
    // but it won't work, because the contract is not verifiable 
    const txid1 = await iconDappUser.setOwnership({
      scriptHash: notverifiableScriptHash,
      contractOwner: userOwner.account.scriptHash,
    })
    assert(txid1.length > 0)
    await wait(1200)

    const result = await neoEventListener.waitForApplicationLog(txid1)
    assert(result.executions[0].stack && result.executions[0].stack[0].value === false)

    const {stdout: stdout2} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const verifiableScriptHash = JSON.parse(stdout2)[0].hash

    // user is claiming ownership of the smart contract they can verify
    const txid2 = await iconDappUser.setOwnership({
      scriptHash: verifiableScriptHash,
      contractOwner: userOwner.account.scriptHash,
    }, [
      {
        scopes: 'CalledByEntry',
        account: userOwner.account.scriptHash
      },
      {
        scopes: 'CalledByEntry',
        account: verifiableScriptHash
      },
    ])
    assert(txid2.length > 0)
    await wait(1200)

    // user can change their smart contract's metadata now
    await iconDappUser.setMetadata({
      scriptHash: verifiableScriptHash,
      propertyName,
      value
    })
    await wait(1200)

    contractMetadata = await iconDappUser.getMetadata({scriptHash: verifiableScriptHash})
    assert(contractMetadata[propertyName] === value, 'Property value should have been added')
  })

  it('tests setOwnership with verify method', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappOwner = await getSdk(owner.account)
    const iconDappUser = await getSdk(user.account)
    const propertyName = 'prop1'
    const value = 'https://www.google.com'

    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash

    await iconDappOwner.addProperty({
      propertyName,
      description: 'description1',
    })
    await wait(1200)

    await assert.rejects( 
      async () => await iconDappUser.setMetadata({
        scriptHash: contractScriptHash,
        propertyName,
        value
      }),
      /No authorization$/,
      'User can\'t change metadata if he is not the owner'
    )
    await wait(1200)

    // making sure no value was saved
    let contractMetadata = await iconDappUser.getMetadata({scriptHash: contractScriptHash})
    assert(contractMetadata[propertyName] === undefined, 'Property value should not have been added')
    
    // user is claiming ownership of the smart contract without adding the contract as a signer
    const setOwnershipFail = await iconDappUser.testSetOwnership({
      scriptHash: contractScriptHash,
      contractOwner: user.account.scriptHash,
    })
    assert(setOwnershipFail === false)

    // user is claiming ownership of the smart contract they can verify
    await iconDappUser.setOwnership(
      {
        scriptHash: contractScriptHash,
        contractOwner: user.account.scriptHash,
      },
      [
        {
          account: user.account.scriptHash,
          scopes: 'CalledByEntry',
        },
        {
          account: contractScriptHash,
          scopes: 'CalledByEntry',
        }
      ]
    )
    await wait(1200)

    // user can change their smart contract's metadata now
    const txId = await iconDappUser.setMetadata({
      scriptHash: contractScriptHash,
      propertyName,
      value
    })
    assert(txId.length > 0)
    await wait(1200)

    const applicationLog = await neoEventListener.waitForApplicationLog(txId)
    const txReturn = applicationLog.executions[0]?.stack?.[0].value

    assert(txReturn === true)
    contractMetadata = await iconDappUser.getMetadata({scriptHash: contractScriptHash})
    assert(contractMetadata[propertyName] === value, 'Property value should have been added')

    const otherUser = wallets.find((wallet: any) => wallet.name === 'otherUser')
    const iconDappOtherUser = await getSdk(otherUser.account)

    const canNotChangeMetadata = await iconDappOtherUser.canChangeMetadata({
      contractScriptHash: contractScriptHash,
    })
    assert(canNotChangeMetadata === false)
  })


  it('Tests setOwnership with invalid verification', async () => {
    const otherUser = wallets.find((wallet: any) => wallet.name === 'otherUser')
    const iconDappOtherUser = await getSdk(otherUser.account)

    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash

    await assert.rejects(async () => 
      { 
        await iconDappOtherUser.setOwnership(
          {
            scriptHash: contractScriptHash,
            contractOwner: otherUser.account.scriptHash,
          },
          [
            
            {
              account: otherUser.account.scriptHash,
              scopes: 'CalledByEntry',
            },
            {
              account: contractScriptHash,
              scopes: 'CalledByEntry',
            },
          ],
        )
      }
      ,
      /Invalid$/,
      'User can\'t setOwnership if they can\'t verify the smart contract'
    )
  })

  it('Tests owner canChangeMetadata', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDappOwner = await getSdk(owner.account)

    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash

    // owner is checking if they can change ownership of the smart contract
    const userCanChangeOwnership = await iconDappOwner.canChangeMetadata({
      contractScriptHash,
    })
    assert(userCanChangeOwnership)
  })

  it('Tests canChangeMetadata with verify method', async () => {
    const user = wallets.find((wallet: any) => wallet.name === 'user')
    const iconDappUser = await getSdk(user.account)

    const {stdout} = await exec(`neoxp contract get "verifiable" -i ${neoXpInstancePath}`)
    const contractScriptHash = JSON.parse(stdout)[0].hash

    // user is checking if they can change ownership of the smart contract without adding the contract as a signer
    const userCanChangeOwnershipNoSigner = await iconDappUser.canChangeMetadata({
      contractScriptHash,
    })
    assert(userCanChangeOwnershipNoSigner === false )

    // user is checking if they can change ownership of the smart contract
    const userCanChangeOwnership = await iconDappUser.canChangeMetadata(
      {
        contractScriptHash,
      },
      [
        {
          account: user.account.scriptHash,
          scopes: 'CalledByEntry',
        },
        {
          account: contractScriptHash,
          scopes: 'CalledByEntry',
        }
      ]
    )
    assert(userCanChangeOwnership)
  })

  it('Tests listIcons', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    
    let icons: { scriptHash: string, icons: object }[] = [] 
    for await (const iconsPage of iconDapp.listIcons()) {
      icons.push(...iconsPage)
    }
    
    // 5 smart contracts had their icons added with the set_icons.js setup script (NEO, GAS, FLM, BurgerNEO, GrantSharesGov)
    assert.strictEqual(icons.length, 5)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xd2a4cff31913016155e38e474a2c06d08be276cf"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xf0151f528127558851b39c2cd8aa47da7418ab28"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0x48c40d4666f93408be1bef038b6722404d9a4c2a"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9"), true)
  
    const txid = await iconDapp.setMetadata({
      scriptHash: '0x1234567890123456789012345678901234567890',
      propertyName: 'icon/25x25',
      value: 'https://www.google.com/',
    })
    assert(txid.length > 0)
    await wait(1200)

    icons = []
    for await (const iconsPage of iconDapp.listIcons()) {
      icons.push(...iconsPage)
    }

    assert.strictEqual(icons.length, 6)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0x1234567890123456789012345678901234567890"), true)
  })

  it('Tests listIcons with itemsPerRequest argument', async () => {
    const owner = wallets.find((wallet: any) => wallet.name === 'owner')
    const iconDapp = await getSdk(owner.account)
    
    let icons: { scriptHash: string, icons: object }[] = [] 
    for await (const iconsPage of iconDapp.listIcons(2)) {
      icons.push(...iconsPage)
    }

    // 5 smart contracts had their icons added with the set_icons.js setup script (NEO, GAS, FLM, BurgerNEO, GrantSharesGov)
    assert.strictEqual(icons.length, 5)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xd2a4cff31913016155e38e474a2c06d08be276cf"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xf0151f528127558851b39c2cd8aa47da7418ab28"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0x48c40d4666f93408be1bef038b6722404d9a4c2a"), true)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0xf15976ea5c020aaa12b9989aa9880e990eb5dcc9"), true)

    const txid = await iconDapp.setMetadata({
      scriptHash: '0x1234567890123456789012345678901234567890',
      propertyName: 'icon/25x25',
      value: 'https://www.google.com/',
    })
    assert(txid.length > 0)
    await wait(1200)

    icons = []
    for await (const iconsPage of iconDapp.listIcons(2)) {
      icons.push(...iconsPage)
    }

    assert.strictEqual(icons.length, 6)
    assert.strictEqual(icons.some(icon => icon.scriptHash==="0x1234567890123456789012345678901234567890"), true)
  })

})
