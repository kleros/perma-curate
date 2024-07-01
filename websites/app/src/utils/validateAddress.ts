import { isAddress } from 'ethers'
import request, { gql } from 'graphql-request'
import { registryMap } from './fetchItems'

export interface Issue {
  severity: 'warn' | 'error'
  message: string
}

const getDupesInRegistry = async (
  richAddress: string,
  registryAddress: string,
  domain?: string
): Promise<number> => {
  const query = gql`
    query ($registry: String!, $richAddress: String!) {
      litems(
        where: {
          registry: $registry,
          status_in: ["Registered", "ClearingRequested"],
          metadata_ : { key0_contains_nocase: $richAddress,
            ${domain ? `key1_starts_with_nocase: "${domain}"` : ''}
              },
        }
      ) {
        id
      }
    }
  `

  const result = (await request({
    url: 'https://api.studio.thegraph.com/query/61738/legacy-curate-gnosis/version/latest',
    document: query,
    variables: {
      registry: registryAddress,
      richAddress,
    },
  })) as any
  const items = result.litems
  return items.length
}

// null
const getAddressValidationIssue = async (
  chainId: string,
  address: string,
  registry: string,
  domain?: string
): Promise<Issue | null> => {
  if (!address) return null

  // check its an address. we dont check checksum.
  if (!isAddress(address)) {
    return { message: 'Not a valid EVM address', severity: 'error' }
  }
  
  if (registry === 'CDN' && !domain) return null
  // check its not a dupe.
  const ndupes = await getDupesInRegistry(
    chainId + ':' + address,
    registryMap[registry],
    domain
  )
  if (ndupes > 0) return { message: 'Duplicate submission', severity: 'error' }

  // check if its a contract. TODO
  return null
}

export default getAddressValidationIssue
