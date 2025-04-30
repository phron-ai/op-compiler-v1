interface ChainInfo {
    icon: string;
    name: string;
    explorer: string;
    API_KEY: string;
    BASE_URL: string;
  }
  
  type ChainInfoMap = Record<string, ChainInfo>;
  
  