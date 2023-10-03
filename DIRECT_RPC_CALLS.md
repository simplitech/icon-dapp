# Reading IconDapp data making direct calls to the RPC Server
IconDapp offers a comprehensive [SDK](README.md#install-the-sdk) designed to simplify your interactions with its SmartContract. This powerful tool handles all necessary conversions and seamlessly integrates with WalletConnect, ensuring a smooth user experience.

However, if you prefer a more direct approach, this guide will walk you through the process of making a quick RPC Server call to obtain the specific information you're seeking. Let's dive in and enhance your understanding of IconDapp's capabilities.

## getProperties
Returns an object with pairs of the name of the property and a description of the icons.

### cURL Example
```bash
curl --location 'http://seed1.neo.org:10332' \
--header 'Content-Type: application/json' \
--data '{
  "method": "invokefunction",
  "params": [
    "0x489e98351485bbd85be99618285932172f1862e4",
    "getProperties",
    []
  ],  
  "jsonrpc": "2.0",
  "id": 1
}'
```

#### Response
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "script": "wh8MDWdldFByb3BlcnRpZXMMFORiGC8XMlkoGJbpW9i7hRQ1mJ5IQWJ9W1I=",
        "state": "HALT",
        "gasconsumed": "352338",
        "exception": null,
        "notifications": [],
        "stack": [
            {
                "type": "Map",
                "value": [
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "aWNvbi8yNXgyNQ=="
                        },
                        "value": {
                            "type": "ByteString",
                            "value": "SWNvbiB3aXRoIGEgMjV4MjUgcGl4ZWxzIHJlc29sdXRpb24="
                        }
                    },
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "aWNvbi8yODh4Mjg4"
                        },
                        "value": {
                            "type": "ByteString",
                            "value": "SWNvbiB3aXRoIGEgMjg4eDI4OCBwaXhlbHMgcmVzb2x1dGlvbg=="
                        }
                    }
                ]
            }
        ]
    }
}
```

## getMetaData
Returns an object with the metadata of the icons of a smart contract. If the smart contract is a child it will return an object with 'parent' as a key.

### cURL Example (Forthewin)
```bash
curl --location 'http://seed1.neo.org:10332' \
--header 'Content-Type: application/json' \
--data '{
  "method": "invokefunction",
  "params": [
    "0x489e98351485bbd85be99618285932172f1862e4",
    "getMetaData",
    [{ "type": "Hash160", "value": "0xf853a98ac55a756ae42379a312d55ddfdf7c8514" }]
  ],  
  "jsonrpc": "2.0",
  "id": 1
}'
```

#### Response
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "script": "DBQUhXzf313VEqN5I+RqdVrFiqlT+BHAHwwLZ2V0TWV0YURhdGEMFORiGC8XMlkoGJbpW9i7hRQ1mJ5IQWJ9W1I=",
        "state": "HALT",
        "gasconsumed": "546918",
        "exception": null,
        "notifications": [],
        "stack": [
            {
                "type": "Map",
                "value": [
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "aWNvbi8yNXgyNQ=="
                        },
                        "value": {
                            "type": "ByteString",
                            "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yNXgyNS9Gb3J0aGV3aW4ucG5n"
                        }
                    },
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "aWNvbi8yODh4Mjg4"
                        },
                        "value": {
                            "type": "ByteString",
                            "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yODh4Mjg4L0ZvcnRoZXdpbi5wbmc="
                        }
                    },
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "cGFyZW50"
                        },
                        "value": {
                            "type": "ByteString",
                            "value": "wIsrB3K4Y0n1DGX4Ia2FvzA7v3Y="
                        }
                    }
                ]
            }
        ]
    }
}
```

## getMultipleMetaData
Returns an object with the metadata of the icons of multiple smart contracts.

### cURL Example (Forthewin and Tothemoon)
```bash
curl --location 'http://seed1.neo.org:10332' \
--header 'Content-Type: application/json' \
--data '{
  "method": "invokefunction",
  "params": [
    "0x489e98351485bbd85be99618285932172f1862e4",
    "getMultipleMetaData",
    [{
        "type": "Array",
        "value": [
            { "type": "Hash160", "value": "0xf853a98ac55a756ae42379a312d55ddfdf7c8514" },
            { "type": "Hash160", "value": "0xc0283310a5117b9d007941e8a0dc3dae9593f65c" }
        ]
    }] 
  ],
  "jsonrpc": "2.0",
  "id": 1
}'
```

#### Response
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "script": "DBRc9pOVrj3coOhBeQCdexGlEDMowAwUFIV8399d1RKjeSPkanVaxYqpU/gSwBHAHwwTZ2V0TXVsdGlwbGVNZXRhRGF0YQwU5GIYLxcyWSgYlulb2LuFFDWYnkhBYn1bUg==",
        "state": "HALT",
        "gasconsumed": "1048689",
        "exception": null,
        "notifications": [],
        "stack": [
            {
                "type": "Map",
                "value": [
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "FIV8399d1RKjeSPkanVaxYqpU/g="
                        },
                        "value": {
                            "type": "Map",
                            "value": [
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "aWNvbi8yNXgyNQ=="
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yNXgyNS9Gb3J0aGV3aW4ucG5n"
                                    }
                                },
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "aWNvbi8yODh4Mjg4"
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yODh4Mjg4L0ZvcnRoZXdpbi5wbmc="
                                    }
                                },
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "cGFyZW50"
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "wIsrB3K4Y0n1DGX4Ia2FvzA7v3Y="
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "key": {
                            "type": "ByteString",
                            "value": "XPaTla493KDoQXkAnXsRpRAzKMA="
                        },
                        "value": {
                            "type": "Map",
                            "value": [
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "aWNvbi8yNXgyNQ=="
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yNXgyNS9UT1RIRU1PT04ucG5n"
                                    }
                                },
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "aWNvbi8yODh4Mjg4"
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "aHR0cHM6Ly9pY29uLWRhcHAuczMuYW1hem9uYXdzLmNvbS8yODh4Mjg4L1RPVEhFTU9PTi5wbmc="
                                    }
                                },
                                {
                                    "key": {
                                        "type": "ByteString",
                                        "value": "cGFyZW50"
                                    },
                                    "value": {
                                        "type": "ByteString",
                                        "value": "sqhQ8MmJhhiNJ5poTgD+sye5T6o="
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
```

## getContractParent
A Dapp is often composed of multiple SmartContracts, so in IconDapp, we group them using the keyword "parent." In short, a Dapp has a single "parent" SmartContract for multiple children. If you require information about a SmartContract's parent, you can utilize the getContractParent method. It's important to note that this method is unnecessary for retrieving an icon associated with a child scripthash; you can still utilize getMetaData for this purpose.

### cURL Example (Forthewin)
```bash
curl --location 'http://seed1.neo.org:10332' \
--header 'Content-Type: application/json' \
--data '{
  "method": "invokefunction",
  "params": [
    "0x489e98351485bbd85be99618285932172f1862e4",
    "getContractParent",
    [{ "type": "Hash160", "value": "0xf853a98ac55a756ae42379a312d55ddfdf7c8514" }]
  ],  
  "jsonrpc": "2.0",
  "id": 1
}'
```

#### Response
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "script": "DBQUhXzf313VEqN5I+RqdVrFiqlT+BHAHwwRZ2V0Q29udHJhY3RQYXJlbnQMFORiGC8XMlkoGJbpW9i7hRQ1mJ5IQWJ9W1I=",
        "state": "HALT",
        "gasconsumed": "235701",
        "exception": null,
        "notifications": [],
        "stack": [
            {
                "type": "ByteString",
                "value": "wIsrB3K4Y0n1DGX4Ia2FvzA7v3Y="
            }
        ]
    }
}
```

## listIcons
Returns an Iterator with all smart contracts and respective icons.

### cURL
```bash
curl --location 'http://seed1.neo.org:10332' \
--header 'Content-Type: application/json' \
--data '{
  "method": "invokefunction",
  "params": [
   "0x489e98351485bbd85be99618285932172f1862e4",
    "listIcons",
    [] 
  ],  
  "jsonrpc": "2.0",
  "id": 1
}'
```

#### Response
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "script": "wh8MCWxpc3RJY29ucwwUtTKEODVHu4GOxOyVQP44BS5rmzBBYn1bUg==",
        "state": "HALT",
        "gasconsumed": "197013",
        "exception": null,
        "notifications": [],
        "stack": [
            {
                "type": "InteropInterface",
                "interface": "IIterator",
                "id": "d8ab9312-f880-4b8a-bd15-8c4b6ed90737"
            }
        ],
        "session": "9b0312ac-a4f1-498d-80b6-1dc07e10fdd8"
    }
}
```