import React, { CSSProperties } from 'react';
import './CodeBlock.css';
declare type Props = {
    readonly language: string;
    readonly children: string;
    readonly className?: string;
    readonly style?: CSSProperties;
};
declare const _default: ({ language, children, className, style }: Props) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export default _default;
