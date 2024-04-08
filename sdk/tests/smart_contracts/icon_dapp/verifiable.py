from typing import Any
from boa3.builtin.compile_time import public
from boa3.builtin.interop import runtime, storage
from boa3.builtin.interop.blockchain import Transaction
from boa3.builtin.nativecontract.contractmanagement import ContractManagement
from boa3.builtin.type import UInt160, helper

ADM_KEY = b'owner'


@public
def verify() -> bool:
    owner: UInt160 = storage.get(ADM_KEY)
    return runtime.check_witness(owner)


@public
def change_adm(address: UInt160):
    if verify():
        storage.put(ADM_KEY, address)


@public
def get_adm() -> UInt160:
    adm: UInt160 = storage.get(ADM_KEY)
    return adm


@public
def update(nef: bytes, manifest: str, data: Any):
    if verify():
        ContractManagement.update(nef, helper.to_bytes(manifest), data)


@public
def _deploy(data: Any, update: bool):
    if not update:
        container: Transaction = runtime.script_container
        storage.put(ADM_KEY, container.sender)