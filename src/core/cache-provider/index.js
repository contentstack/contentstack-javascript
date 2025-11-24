import localstorage from './localstorage';
import MESSAGES from './messages';

const CacheProvider = {};

CacheProvider.providers = function (provider) {
  if (provider) {
    return localstorage;
  } else {
    console.error(MESSAGES.CACHE_PROVIDER_MISSING);
  }
};

CacheProvider.policies = {
  IGNORE_CACHE: -1,
  ONLY_NETWORK: 0,
  CACHE_ELSE_NETWORK: 1,
  NETWORK_ELSE_CACHE: 2,
  CACHE_THEN_NETWORK: 3
};

export default CacheProvider;
