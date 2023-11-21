import { Neo3EventListener, Neo3Invoker, Neo3Parser, TypeChecker } from "@cityofzion/neon-dappkit-types"
import * as Invocation from './api'
import { ScriptHashAndIcons, IconProperties } from './types'

export type SmartContractConfig = {
  scriptHash: string;
  invoker: Neo3Invoker;
  parser?: Neo3Parser;
  eventListener?: Neo3EventListener | null;
}

export class IconDapp{
  static MAINNET = '0x489e98351485bbd85be99618285932172f1862e4'
  static TESTNET = '0x309b6b2e0538fe4095ecc48e81bb4735388432b5'

  private config: Required<SmartContractConfig>

	constructor(configOptions: SmartContractConfig) {
		this.config = { 
			...configOptions, 
			parser: configOptions.parser ?? require("@cityofzion/neon-dappkit").NeonParser,
			eventListener: configOptions.eventListener ?? null
		}
	}

  /**
   * Updates the smart contract if an admin is calling this method
   */
	async update(params: { nefFile: string, manifest: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.updateAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Tests updating the smart contract
   */
	async testUpdate(params: { nefFile: string, manifest: string } ): Promise<void>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.updateAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
	}

  /**
   * Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.
   */
	async name(): Promise<string>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.nameAPI(this.config.scriptHash)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'String' })
	}

  /**
   * Returns the name of the owner of the smart contract. The owner is the one who deployed the smart contract.
   */
  async getOwner(): Promise<string>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.getOwnerAPI(this.config.scriptHash)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Hash160' })
	}

  /**
   * Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
  async addProperty(params: { propertyName: string, description: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.addPropertyAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Adds a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
	async testAddProperty(params: { propertyName: string, description: string } ): Promise<boolean>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.addPropertyAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Boolean' })
	}

  /**
   * Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
	async updateProperty(params: { propertyName: string, description: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.updatePropertyAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Updates a property to the Icons, e.g., icons-24, icons-36, icons-24-dark (not the final names just examples of properties). (Admin only)
   */
	async testUpdateProperty(params: { propertyName: string, description: string } ): Promise<boolean>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.updatePropertyAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Boolean' })
	}

  /**
   * Returns all Icon properties.
   */
	async getProperties(): Promise<IconProperties & Record<string, any>> {
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.getPropertiesAPI(this.config.scriptHash)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Map' })
	}

  /**
   * Adds a property to the metadata of a smart contract. (Admin and deployer only)
   */
	async setMetaData(params: { scriptHash: string, propertyName: string, value: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.setMetaDataAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Adds a property to the metadata of a smart contract. (Admin and deployer only)
   */
	async testSetMetaData(params: { scriptHash: string, propertyName: string, value: string } ): Promise<boolean>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.setMetaDataAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Boolean' })
	}

  /**
   * Returns the metadata of a smart contract. If the smart contract is a child it will return a map with 'parent' as a key.
   */
	async getMetaData(params: { scriptHash: string } ): Promise<IconProperties & Record<string, any>> {
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.getMetaDataAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Map' })
	}

  /**
   * Returns the metadata of multiple smart contracts.
   */
	async getMultipleMetaData(params: { contractHashes: string[] } ): Promise<Map<string, Map<string, string>>[]> {
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.getMultipleMetaDataAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { 
			type: 'Map', 
			genericKey: { type: 'Hash160' }, 
			genericItem: { type: 'Map', genericKey: { type: 'String' }, genericItem: { type: 'String' } }
		})
	}

  /**
   * Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)
   */
	async setContractParent(params: { childHash: string, parentHash: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.setContractParentAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Sets the parent of a smart contract, children will have the same metadata as the parent. (Admin and deployer only)
   */
	async testSetContractParent(params: { childHash: string, parentHash: string } ): Promise<boolean>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.setContractParentAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Boolean' })
	}

  /**
   * Returns the parent of a smart contract. If there is no parent it will return null.
   */
	async getContractParent(params: { childHash: string } ): Promise<string>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.getContractParentAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Hash160' })
	}

  /**
   * Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.
   */
	async setOwnership(params: { scriptHash: string, contractOwner: string } ): Promise<string>{
		return await this.config.invoker.invokeFunction({
			invocations: [Invocation.setOwnershipAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})
	}

  /**
   * Sets the owner of a smart contract. If sender is not the owner of the smart contract, then it will return false.
   */
	async testSetOwnership(params: { scriptHash: string, contractOwner: string } ): Promise<boolean>{
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.setOwnershipAPI(this.config.scriptHash, params, this.config.parser)],
			signers: [],
		})

		if (res.stack.length === 0) {
			throw new Error(res.exception ?? 'unrecognized response')
		}
		
		return this.config.parser.parseRpcResponse(res.stack[0], { type: 'Boolean' })
	}

  /**
   * Returns a iterator with all the icons on the smart contract.
   */
	async* listIcons(itemsPerRequest: number = 20): AsyncGenerator<ScriptHashAndIcons[], void> {
		const res = await this.config.invoker.testInvoke({
			invocations: [Invocation.listIconsAPI(this.config.scriptHash)],
			signers: [],
		})

		if (res.stack.length !== 0 && res.session !== undefined && TypeChecker.isStackTypeInteropInterface(res.stack[0])) {

			let iterator = await this.config.invoker.traverseIterator(res.session, res.stack[0].id, itemsPerRequest)

			while (iterator.length !== 0){
				if (TypeChecker.isStackTypeInteropInterface(iterator[0])){
					throw new Error(res.exception ?? 'can not have an iterator inside another iterator')
				}else{
					const iteratorValues = iterator.map((item) => {
            if (!TypeChecker.isStackTypeInteropInterface(item)){
              return {
                scriptHash: this.config.parser.parseRpcResponse(item.value[0], { type: "Hash160"}),
                icons: this.config.parser.parseRpcResponse(item.value[1], { type: "String" }),
              }
            } else {
              return this.config.parser.parseRpcResponse(item)
            }
					})

					yield iteratorValues
					iterator = await this.config.invoker.traverseIterator(res.session, res.stack[0].id, itemsPerRequest)
				}
			}
		}
		else {
			throw new Error(res.exception ?? 'unrecognized response')
		}
	}
}
