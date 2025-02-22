export const NEXUSTOKEN = {
  id: 392,
  name: "Nexus",
  network: "Nexus",
  nativeCurrency: {
    decimals: 18,
    name: "$NEX",
    symbol: "$NEX",
  },
  rpcUrls: {
    public: { http: ["https://rpc.nexus.xyz/http"] },
    default: { http: ["https://rpc.nexus.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Nexus",
      url: "https://explorer.nexus.xyz",
    },
  },
  contracts: {
    MyContract: {
      address: "0xA3eFe7430E1cc3e1e12dF811fc5cF6D635E0B41F",
    },
  },
};