export const NEXUSNFT = {
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
        address: "0x8d68DbFE90e587df172722356af47f6A46b2EFaE",
      },
    },
  };