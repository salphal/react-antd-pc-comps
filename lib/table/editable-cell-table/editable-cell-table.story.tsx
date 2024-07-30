import React, { useState } from 'react';
import EditAbleTable, { type EditAbleCellTableProps } from './editable-cell-table.tsx';
import { editAbleTableDataSource } from '@lib/table/editable-cell-table/editable-cell-table.mock.tsx';

export const EditAbleTableStory = React.forwardRef<any, EditAbleCellTableProps>(
  (
    {
      columns = [],
      dataSource = [],
      setDataSource,
      addable = false,
      rowKey = 'id',
      defaultRowData = {},
      optionColumnRender = (row, config, defaultDoms) => {
        return [defaultDoms.delete];
      },
      ...rest
    },
    ref,
  ) => {
    const [data, setData] = useState([...editAbleTableDataSource]);
    const optionsColumn = {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: () => {
        return null;
      },
    };
    const props = {
      columns: [...columns, optionsColumn],
      dataSource: data,
      setDataSource: setData,
      addable,
      rowKey,
      defaultRowData,
      ...rest,
    };

    return (
      <EditAbleTable
        ref={ref}
        {...props}
      />
    );
  },
);

EditAbleTableStory.displayName = 'EditAbleTableStory';

export default React.memo(EditAbleTableStory);