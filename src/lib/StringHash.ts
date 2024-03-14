import murmurHash3 from 'murmurhash3js';

/**
 * Compute a 32-bit hash value for a string using the murmur3 hashing algorithm.
 * @link https://github.com/aappleby/smhasher/blob/master/src/MurmurHash3.cpp
 * @param str The value to be hashed
 * @returnThe 32-bit hash value as an integer
 */
export function stringHash(str: string): number {
  return murmurHash3.x86.hash32(str);
}
