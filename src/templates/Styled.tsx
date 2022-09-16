import type { ReactNode } from 'react';

type ITextProps = {
  children: ReactNode;
};

const Title16Styled = (props: ITextProps) => {
  return (
    <span className={'text-lg capitalize text-slate-900'}>
      {props.children}
    </span>
  );
};

const Text14Styled = (props: ITextProps) => {
  return (
    <span className={'text-base capitalize text-slate-800'}>
      {props.children}
    </span>
  );
};

export { Text14Styled, Title16Styled };
