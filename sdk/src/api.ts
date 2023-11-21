import { Neo3Parser, ContractInvocation} from "@cityofzion/neon-dappkit-types"

export function updateAPI(scriptHash: string, params: { nefFile: string, manifest: string }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'update',
		args: [parser.formatRpcArgument(params.nefFile, { type: 'ByteArray' }),parser.formatRpcArgument(params.manifest, { type: 'ByteArray' }),
		],
	}
}

export function nameAPI(scriptHash: string): ContractInvocation {
	return {
		scriptHash,
		operation: 'name',
		args: [
		],
	}
}

export function getOwnerAPI(scriptHash: string): ContractInvocation {
	return {
		scriptHash,
		operation: 'getOwner',
		args: [
		],
	}
}

export function addPropertyAPI(scriptHash: string, params: { propertyName: string, description: string }, parser: Neo3Parser ): ContractInvocation {
	if (params.propertyName.length >= 31 || params.propertyName.length <= 0){
		throw new Error('Length of propertyName is incorrect, it should be between 1 and 30');
	}

	if (params.description.length >= 255 || params.description.length <= 0){
		throw new Error('Length of description is incorrect, it should be between 1 and 254');
	}

	return {
		scriptHash,
		operation: 'addProperty',
		args: [parser.formatRpcArgument(params.propertyName, { type: 'String' }),parser.formatRpcArgument(params.description, { type: 'String' }),
		],
	}
}

export function updatePropertyAPI(scriptHash: string, params: { propertyName: string, description: string }, parser: Neo3Parser ): ContractInvocation {
	if (params.propertyName.length >= 31 || params.propertyName.length <= 0){
		throw new Error('Length of propertyName is incorrect, it should be between 1 and 30');
	}
	
	if (params.description.length >= 255 || params.description.length <= 0){
		throw new Error('Length of description is incorrect, it should be between 1 and 254');
	}

	return {
		scriptHash,
		operation: 'updateProperty',
		args: [parser.formatRpcArgument(params.propertyName, { type: 'String' }),parser.formatRpcArgument(params.description, { type: 'String' }),
		],
	}
}

export function getPropertiesAPI(scriptHash: string): ContractInvocation {
	return {
		scriptHash,
		operation: 'getProperties',
		args: [
		],
	}
}

export function setMetaDataAPI(scriptHash: string, params: { scriptHash: string, propertyName: string, value: string }, parser: Neo3Parser ): ContractInvocation {
	if (params.value.length >= 390 || params.value.length <= 0){
		throw new Error('Length of value is incorrect, it should be between 1 and 389');
	}
	
	return {
		scriptHash,
		operation: 'setMetaData',
		args: [parser.formatRpcArgument(params.scriptHash, { type: 'Hash160' }),parser.formatRpcArgument(params.propertyName, { type: 'String' }),parser.formatRpcArgument(params.value, { type: 'String' }),
		],
	}
}

export function getMetaDataAPI(scriptHash: string, params: { scriptHash: string }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'getMetaData',
		args: [parser.formatRpcArgument(params.scriptHash, { type: 'Hash160' }),
		],
	}
}

export function getMultipleMetaDataAPI(scriptHash: string, params: { contractHashes: any[] }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'getMultipleMetaData',
		args: [parser.formatRpcArgument(params.contractHashes, { type: 'Array', generic: { type: 'Hash160' } }),
		],
	}
}

export function setContractParentAPI(scriptHash: string, params: { childHash: string, parentHash: string }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'setContractParent',
		args: [parser.formatRpcArgument(params.childHash, { type: 'Hash160' }),parser.formatRpcArgument(params.parentHash, { type: 'Hash160' }),
		],
	}
}

export function getContractParentAPI(scriptHash: string, params: { childHash: string }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'getContractParent',
		args: [parser.formatRpcArgument(params.childHash, { type: 'Hash160' }),
		],
	}
}

export function setOwnershipAPI(scriptHash: string, params: { scriptHash: string, contractOwner: string }, parser: Neo3Parser ): ContractInvocation {
	return {
		scriptHash,
		operation: 'setOwnership',
		args: [parser.formatRpcArgument(params.scriptHash, { type: 'Hash160' }),parser.formatRpcArgument(params.contractOwner, { type: 'Hash160' }),
		],
	}
}

export function listIconsAPI(scriptHash: string): ContractInvocation {
	return {
		scriptHash,
		operation: 'listIcons',
		args: [
		],
	}
}
