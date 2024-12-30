import React from "react";

type Props<T> = {
    items: T[];
    render: (item: T, index: number, items: T[]) => React.ReactNode;
    keyExtractor: (item: T, index: number, items: T[]) => string;
};

export function RenderList<T>({ items, render, keyExtractor }: Props<T>) {
    return (
        <React.Fragment>
            {items.map((item, index) => (
                <React.Fragment key={keyExtractor(item, index, items)}>
                    {render(item, index, items)}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
}
