import React, { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { calcMinMax } from 'utils/calcMinMax'
import DownDirectionIcon from 'tsx:svgs/icons/down-direction.svg'
import { useFocusOutside } from '~src/hooks/useFocusOutside'

const FilterContainer = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
`

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`

const FilterDropdown = styled.div<{ open: boolean }>`
  font-size: 20px;
  font-family: 'Orbitron', sans-serif;
  display: flex;
  flex-direction: row;
`

const FilterDropdownIconWrapper = styled.div<{ open: boolean }>`
  margin-left: 8px;
  padding-bottom: 4px;
  transform: ${({ open }) => (open ? 'rotate(-180deg)' : 'rotate(0deg)')};
`

const FilterOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #883ae1;
  margin-top: 30px;
  position: absolute;
`

// when selected, has a border, bold and more opacity
const FilterOption = styled.div<{ selected: boolean }>`
  text-align: center;
  font-family: 'Oxanium', sans-serif;
  font-size: 16px;
  padding: 6px;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  opacity: ${({ selected }) => (selected ? '100%' : '60%')};
`

// renders right of the dropdown filter
const RemovableFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const RemovableFilter = styled.div`
  background-color: #380c65;
  font-family: 'Oxanium', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding-top: 6px;
  padding-bottom: 4px;
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 6px;
  margin-right: 4px;
  max-height: 28px;
`

const Statuses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)
  const statuses = useMemo(() => searchParams.getAll('status'), [searchParams])
  const disputeds = useMemo(
    () => searchParams.getAll('disputed'),
    [searchParams]
  )
  const dropdownRef = useRef(null)
  useFocusOutside(dropdownRef, () => setOpen((open) => false))

  const toggleStatus = (status: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const statuses = newParams.getAll('status')
      if (statuses.includes(status)) {
        // remove
        newParams.delete('status', status)
      } else {
        // add
        newParams.append('status', status)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  const toggleDisputed = (boolString: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const statuses = newParams.getAll('disputed')
      if (statuses.includes(boolString)) {
        // remove all
        newParams.delete('disputed')
        // append the opposite
        newParams.append('disputed', boolString === 'true' ? 'false' : 'true')
      } else {
        // add
        newParams.append('disputed', boolString)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  const toggleStatusOrDisputed = (s: string) => {
    if (s === 'true' || s === 'false') {
      toggleDisputed(s)
    } else {
      toggleStatus(s)
    }
  }

  return (
    <FilterContainer>
      <DropdownContainer ref={dropdownRef}>
        <FilterDropdown open={open} onClick={() => setOpen((open) => !open)}>
          Status
          <FilterDropdownIconWrapper open={open}>
            <DownDirectionIcon />
          </FilterDropdownIconWrapper>
        </FilterDropdown>
        {open && (
          <FilterOptionContainer>
            <FilterOption
              selected={statuses.includes('Registered')}
              onClick={() => toggleStatusOrDisputed('Registered')}
            >
              Registered
            </FilterOption>
            <FilterOption
              selected={statuses.includes('RegistrationRequested')}
              onClick={() => toggleStatusOrDisputed('RegistrationRequested')}
            >
              Submitted
            </FilterOption>
            <FilterOption
              selected={statuses.includes('ClearingRequested')}
              onClick={() => toggleStatusOrDisputed('ClearingRequested')}
            >
              Removing
            </FilterOption>
            <FilterOption
              selected={statuses.includes('Absent')}
              onClick={() => toggleStatusOrDisputed('Absent')}
            >
              Removed
            </FilterOption>
            {/* separation bar here? todo */}
            <FilterOption
              selected={disputeds.includes('false')}
              onClick={() => toggleStatusOrDisputed('false')}
            >
              Unchallenged
            </FilterOption>
            <FilterOption
              selected={disputeds.includes('true')}
              onClick={() => toggleStatusOrDisputed('true')}
            >
              Challenged
            </FilterOption>
          </FilterOptionContainer>
        )}
      </DropdownContainer>
      <RemovableFilterContainer>
        {statuses.map((s) => (
          <RemovableFilter key={s} onClick={() => toggleStatus(s)}>
            {
              {
                Registered: 'Registered',
                RegistrationRequested: 'Submitted',
                ClearingRequested: 'Removing',
                Absent: 'Removed',
              }[s]
            }{' '}
            ✕
          </RemovableFilter>
        ))}
        {disputeds.map((s) => (
          <RemovableFilter key={s} onClick={() => toggleDisputed(s)}>
            {
              {
                true: 'Challenged',
                false: 'Unchallenged',
              }[s]
            }{' '}
            ✕
          </RemovableFilter>
        ))}
      </RemovableFilterContainer>
    </FilterContainer>
  )
}

const Networks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)
  const networks = useMemo(() => searchParams.getAll('network'), [searchParams])
  const dropdownRef = useRef(null)
  useFocusOutside(dropdownRef, () => setOpen((open) => false))

  const toggleNetwork = (network: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const networks = newParams.getAll('network')
      if (networks.includes(network)) {
        // remove
        newParams.delete('network', network)
      } else {
        // add
        newParams.append('network', network)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <FilterContainer>
      <DropdownContainer ref={dropdownRef}>
        <FilterDropdown open={open} onClick={() => setOpen((open) => !open)}>
          Network
          <FilterDropdownIconWrapper open={open}>
            <DownDirectionIcon />
          </FilterDropdownIconWrapper>
        </FilterDropdown>
        {open && (
          <FilterOptionContainer>
            <FilterOption
              selected={networks.includes('1')}
              onClick={() => toggleNetwork('1')}
            >
              Mainnet
            </FilterOption>
            <FilterOption
              selected={networks.includes('100')}
              onClick={() => toggleNetwork('100')}
            >
              Gnosis
            </FilterOption>
            <FilterOption
              selected={networks.includes('137')}
              onClick={() => toggleNetwork('137')}
            >
              Polygon
            </FilterOption>
            <FilterOption
              selected={networks.includes('56')}
              onClick={() => toggleNetwork('56')}
            >
              BSC
            </FilterOption>
          </FilterOptionContainer>
        )}
      </DropdownContainer>
      <RemovableFilterContainer>
        {networks.map((s) => (
          <RemovableFilter key={s} onClick={() => toggleNetwork(s)}>
            {
              {
                '1': 'Mainnet',
                '100': 'Gnosis',
                '137': 'Polygon',
                '56': 'BSC',
              }[s]
            }{' '}
            ✕
          </RemovableFilter>
        ))}
      </RemovableFilterContainer>
    </FilterContainer>
  )
}

const Ordering: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const direction = useMemo(
    () => searchParams.get('orderDirection'),
    [searchParams]
  )

  const toggleDirection = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const direction = newParams.get('orderDirection')
      newParams.delete('orderDirection')
      if (direction === 'desc') {
        newParams.append('orderDirection', 'asc')
      } else {
        newParams.append('orderDirection', 'desc')
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <FilterContainer>
      <DropdownContainer>
        <FilterDropdown
          open={direction === 'desc'}
          onClick={() => toggleDirection()}
        >
          {direction === 'desc' ? 'Newest' : 'Oldest'}
          <FilterDropdownIconWrapper open={direction === 'asc'}>
            <DownDirectionIcon />
          </FilterDropdownIconWrapper>
        </FilterDropdown>
      </DropdownContainer>
    </FilterContainer>
  )
}

const Container = styled.div`
  display: flex;
  width: 84vw;
  margin-bottom: ${calcMinMax(4, 8)};
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      width: 80%;
      flex-direction: row;
    `
  )}
`

const Filters: React.FC = () => {
  return (
    <Container>
      <Statuses />
      <Networks />
      <Ordering />
    </Container>
  )
}

export default Filters
