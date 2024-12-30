import React from "react";

type Props = {
    value: boolean;
    children: React.ReactNode | React.ReactNode[];
};
export function Switch({ value, children }: Props) {
    const array = React.Children.toArray(children);
    const left = array.length > 0 ? array[0] : null;
    const right = array.length > 1 ? array[1] : null;

    return value ? left : right;
}
