import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import EditAbleTable, { type EditAbleCellTableProps } from './editable-cell-table';
import { EditAbleTableStory } from './editable-cell-table.story';
import { editAbleTableColumns, editAbleTableDataSource } from './editable-cell-table.mock';

const meta = {
  title: 'Components/Table/EditAbleTable',
  component: EditAbleTableStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {},
} satisfies Meta<typeof EditAbleTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: EditAbleCellTableProps = {
  columns: editAbleTableColumns,
  dataSource: editAbleTableDataSource,
  setDataSource: () => {},
  addable: true,
  defaultRowData: {
    input: '',
    select: 'select1',
    radio: 'radio1',
  },
};

export const DefaultEditAbleTable: Story = {
  args: {
    ...defaultProps,
  },
};