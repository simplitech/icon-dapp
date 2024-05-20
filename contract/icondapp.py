from typing import Any, List, Optional

from boa3.builtin.compile_time import NeoMetadata, metadata, public
from boa3.builtin.interop import runtime, storage
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.interop.contract import Contract
from boa3.builtin.interop.contract.contractmanifest import ContractAbi
from boa3.builtin.interop.contract.contractmanifest import ContractManifest
from boa3.builtin.interop.iterator import Iterator
from boa3.builtin.nativecontract.contractmanagement import ContractManagement
from boa3.builtin.nativecontract.cryptolib import CryptoLib
from boa3.builtin.nativecontract.stdlib import StdLib
from boa3.builtin.type import UInt160, helper


# -------------------------------------------
# METADATA
# -------------------------------------------

@metadata
def manifest_metadata() -> NeoMetadata:
    """
    Defines this smart contract's metadata information
    """
    meta = NeoMetadata()
    meta.description = "Smart Contract icon management prop. Made by meevee98, lock9, luc10921. Visit icondapp.io to discover more of the ecosystem."
    meta.name = "IconDapp"
    meta.author = "Simpli"
    meta.email = "contact@simplitech.io"
    meta.source = "https://github.com/simplitech/icon-dapp"
    meta.supported_standards = []
    # requires access to ContractManagement methods
    meta.add_permission(contract='0xfffdc93764dbaddd97c48f252a53ea4643faa3fd',
                        methods=['update', 'destroy'])
    return meta


@public
def _deploy(data: Any, update: bool):
    if not update:
        # setup instructions that will be executed when the smart contract is deployed
        container: Transaction = runtime.script_container
        storage.put(get_owner_key(), container.sender)
    else:
        # code for updating the contract after it was deployed
        return
    return


@public
def update(nef_file: bytes, manifest: bytes):
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')
    ContractManagement.update(nef_file, manifest)


@public
def name() -> str:
    return "IconDapp"


@public(name="getOwner", safe=True)
def get_owner() -> UInt160:
    return UInt160(storage.get(get_owner_key()))


@public(name="addProperty")
def add_property(property_name: str, description: str) -> bool:
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    assert 0 < len(property_name) < 31
    assert 0 < len(description) < 255

    properties_key = get_properties_key()
    property_bytes = storage.get(properties_key)
    can_set = True

    # using two if's instead of one with a 'and' operation because it had runtime errors
    if property_bytes is not None:
        if len(property_bytes) > 0:
            properties_json = StdLib.deserialize(property_bytes)
            properties: dict = properties_json

            if property_name in properties:
                can_set = properties[property_name] is None
        else:
            properties: dict = {property_name: description}
    else:
        properties: dict = {property_name: description}

    if not can_set:
        raise Exception("Property name already exists")

    properties[property_name] = description
    storage.put(properties_key, StdLib.serialize(properties))

    return True


@public(name="updateProperty")
def update_property(property_name: str, description: str) -> bool:
    # admin only
    if not runtime.check_witness(get_owner()):
        raise Exception('No authorization')

    assert 0 < len(property_name) < 31
    assert 0 < len(description) < 255

    properties_key = get_properties_key()
    property_bytes = storage.get(properties_key)

    # using two if's instead of one with a 'or' operation because it had runtime errors
    if property_bytes is None:
        raise Exception("Invalid property")
    if len(property_bytes) == 0:
        raise Exception("Invalid property")

    properties_json = StdLib.deserialize(property_bytes)
    properties: dict = properties_json

    if property_name not in properties:
        raise Exception("Invalid property")

    properties[property_name] = description
    storage.put(properties_key, StdLib.serialize(properties))

    return True


@public(name="getProperties", safe=True)
def get_properties() -> dict:
    properties_bytes = storage.get(get_properties_key())
    if properties_bytes is not None and len(properties_bytes) > 0:
        properties_json = StdLib.deserialize(properties_bytes)
        properties: dict = properties_json
        return properties
    else:
        return {}


@public(name="setMetadata")
def set_owner_and_metadata(owner: UInt160, contract_script_hash: UInt160, property_name: str, value: str) -> bool:
    contract_owner: UInt160 = get_contract_owner(contract_script_hash)

    is_owner = runtime.check_witness(get_owner())
    contract_has_owner = isinstance(contract_owner, UInt160)

    if not is_owner and contract_has_owner:
        raise Exception('Owner already was set')

    has_ownership = set_ownership(contract_script_hash, owner)
    
    if not has_ownership:
        raise Exception('No authorization')
    
    return set_metadata(contract_script_hash, property_name, value) 

@public(name="setMetadata")
def set_only_metadata(script_hash: UInt160, property_name: str, value: str) -> bool:
    # admin or deployer
    if not runtime.check_witness(get_owner()):
        contract_owner: UInt160 = get_contract_owner(script_hash)
        # using two if's instead of one with a or operation because it had runtime errors
        if not isinstance(contract_owner, UInt160):
            raise Exception('No authorization')
        if not runtime.check_witness(contract_owner):
            raise Exception('No authorization')
        
    return set_metadata(script_hash, property_name, value)


def set_metadata(script_hash: UInt160, property_name: str, value: str) -> bool:
    assert 0 < len(value) < 390

    property_names = get_properties()
    if property_name not in property_names:
        raise Exception('Undefined property name')

    if property_names[property_name] is None:
        raise Exception('Undefined property name')

    contract_properties = get_metadata(script_hash)
    contract_properties[property_name] = value
    contract_key = get_contract_property_key(script_hash)
    storage.put(contract_key, StdLib.serialize(contract_properties))
    return True

@public(name="getMetadata", safe=True)
def get_metadata(script_hash: UInt160) -> dict:
    parent_contract = get_contract_parent(script_hash)
    if isinstance(parent_contract, UInt160):
        contract_key = get_contract_property_key(parent_contract)
    else:
        contract_key = get_contract_property_key(script_hash)

    contract_properties_bytes = storage.get(contract_key)
    contract_properties = {}

    if contract_properties_bytes is not None and len(contract_properties_bytes) > 0:
        properties_json = StdLib.deserialize(contract_properties_bytes)
        contract_properties: dict = properties_json

    if isinstance(parent_contract, UInt160):
        contract_properties["parent"] = parent_contract

    return contract_properties


@public(name="getMultipleMetadata", safe=True)
def get_multiple_metadata(contract_hashes: List[UInt160]) -> dict:
    metadata = {}
    for hash in contract_hashes:
        contract_metadata = get_metadata(hash)
        metadata[hash] = contract_metadata
    return metadata


# Reuses other contract meta-data
@public(name="setContractParent")
def set_contract_parent(child_hash: UInt160, parent_hash: UInt160) -> bool:
    # admin or deployer
    if not runtime.check_witness(get_owner()):
        contract_owner: UInt160 = get_contract_owner(parent_hash)
        # using two if's instead of one with a or operation because it had runtime errors
        if not isinstance(contract_owner, UInt160):
            raise Exception('No authorization')
        if not runtime.check_witness(contract_owner):
            raise Exception('No authorization')

    # check if parent and child are the same
    if parent_hash == child_hash:
        raise Exception(
            "Invalid operation: can't set a contract as its own parent")

    # check if the parent has another parent
    contract_parent = get_contract_parent(parent_hash)
    if isinstance(contract_parent, UInt160):
        if contract_parent == child_hash:
            raise Exception(
                "Invalid operation: can't set a contract child as its parent")
        parent_hash = contract_parent

    child_key = get_child_key(child_hash)
    storage.put(child_key, parent_hash)

    return True


@public(name="getContractParent", safe=True)
def get_contract_parent(child_hash: UInt160) -> Optional[UInt160]:
    # assert len(child_hash) == 20
    storage_result = storage.get(get_child_key(child_hash))
    if len(storage_result) > 0:
        return UInt160(storage_result)
    return None


@public(name="getContractOwner", safe=True)
def get_contract_owner(script_hash: UInt160) -> Optional[UInt160]:
    contract_owner_key = get_contract_owner_key(script_hash)
    storage_result = storage.get(contract_owner_key)
    if len(storage_result) > 0:
        return UInt160(storage_result)

    return None


@public(name='setOwnership')
def set_ownership(script_hash: UInt160, contract_owner: UInt160) -> bool:
    if can_change_metadata(script_hash):
        contract_owner_key = get_contract_owner_key(script_hash)
        storage.put(contract_owner_key, contract_owner)
        return True
    return False


@public(name='canChangeMetadata', safe=True)
def can_change_metadata(contract_script_hash: UInt160) -> bool:
    contract: Contract = ContractManagement.get_contract(contract_script_hash)
    if not isinstance(contract, Contract):
        return False
    
    icon_dapp_owner = get_owner()
    if runtime.check_witness(icon_dapp_owner):
        return True

    contract_abi: ContractAbi = contract.manifest.abi
    has_verify = False
    for method in contract_abi.methods:
        if method.name == 'verify':
            has_verify = True
            break

    if has_verify:
        if runtime.check_witness(contract_script_hash):
            return True
        else:
            return False

    current_contract_owner: UInt160 = get_contract_owner(contract_script_hash)
    if isinstance(current_contract_owner, UInt160):
        if runtime.check_witness(current_contract_owner):
            return True

    return False

@public(name="listIcons", safe=True)
def list_icons() -> Iterator:
    find_option = storage.FindOptions.REMOVE_PREFIX | storage.FindOptions.DESERIALIZE_VALUES
    return storage.find(b"\x03", options=find_option)


# Keys
def get_owner_key() -> bytes:
    return b"\x01"


def get_properties_key() -> bytes:
    return b"\x02"


def get_contract_property_key(script_hash: UInt160) -> bytes:
    return b"\x03" + script_hash


def get_child_key(child_hash: UInt160) -> bytes:
    return b"\x04" + child_hash


def get_contract_owner_key(script_hash: UInt160) -> bytes:
    return b"\x05" + script_hash
