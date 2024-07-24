import React from 'react';
import type { ExampleProps } from '@lib/example/example.tsx';
import Example from './example.tsx';

/**
 * 设置属性默认值
 */
export const ExampleStory = React.forwardRef<any, ExampleProps>(
  (
    {
      string = '',
      number = 0,
      boolean = false,
      object = {},
      select = '',
      multiSelect = [],
      radio = '',
      inlineRadio = '',
      check = [],
      inlineCheck = [],
      range = 15,
      color = '#fff',
      file = {},
      date = new Date().valueOf(),
      onClick = () => {},
      ...rest
    },
    ref,
  ) => {
    const props = {
      string,
      number,
      boolean,
      object,
      select,
      multiSelect,
      radio,
      inlineRadio,
      check,
      inlineCheck,
      range,
      color,
      file,
      date,
      ...rest,
    };
    return (
      <Example
        ref={ref}
        {...props}
      />
    );
  },
);

ExampleStory.displayName = 'ExampleStory';

export default React.memo(ExampleStory);
