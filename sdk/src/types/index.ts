export type IconProperties = {
  "icon/288x288": string | null
  "icon/25x25": string | null
}

export type ScriptHashAndIcons = {
  scriptHash: string,
  icons: IconProperties & Record<string, any>  // Another property could be added to the smart contract
}
