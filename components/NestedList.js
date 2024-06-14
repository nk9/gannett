// Pass this component a nested list of <ol> and <li> elements, and
// you'll get back <List> and <ListItem> objects suitable for use in
// a MaterialUI application. The list style will be set based on the
// nesting depth.

import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
 
const DEFAULT_STYLES = ["decimal", "lower-alpha", "lower-roman", "upper-alpha"];

export default function NestedList({ children, styles = DEFAULT_STYLES }) {
    var key = 0;

    const list = (el, depth) => {

        if (el.type == "ol") {
            let style = styles[depth % styles.length];
            return (
                <List sx={{ listStyle: style, pl: 2, pt: 0, pb: 0 }}>
                    {React.Children.map(el.props.children, (c) => list(c, depth + 1))}
                </List>)
        } else if (el.type == "li") {
            return (
                <ListItem key={key++} sx={{ display: "list-item", pb: 1 }}>
                    {React.Children.map(el.props.children, (c) => list(c, depth))}
                </ListItem>)
        }

        return el;
    }

    return list(children, 0)
}
