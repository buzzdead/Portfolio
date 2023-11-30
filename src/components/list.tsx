import { Box } from '@chakra-ui/react'
import React, { CSSProperties, ReactElement } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactElement
  style?: CSSProperties
}
export const List = <T,>({ items, renderItem, style }: ListProps<T>) => {
  return (
    <Box style={style}>
      {items.map((item, index) => renderItem(item, index))}
    </Box>
  )
}

export default List
