import React from 'react';
import BaseTable, { type BaseTableProps } from './base-table.tsx';

export const BaseTableStory = React.forwardRef<any, BaseTableProps>(
  ({ columns = [], dataSource = [], height = 0, selectable = false, ...rest }, ref) => {
    const props = { columns, dataSource, height, selectable, ...rest };
    return (
      <div className="story-wrap h-500">
        <BaseTable
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

BaseTableStory.displayName = 'BaseTableStory';

export default React.memo(BaseTableStory);
