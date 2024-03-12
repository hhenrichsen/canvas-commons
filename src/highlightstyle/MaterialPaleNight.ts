/*
  Credits for color palette:

  Author:     Mattia Astorino (http://github.com/equinusocio)
  Website:    https://material-theme.site/
*/

import {HighlightStyle} from '@codemirror/language';
import {tags as t} from '@lezer/highlight';

const stone = '#7d8799', // Brightened compared to original to increase contrast
  invalid = '#ffffff';

/// The highlighting style for code in the Material Palenight theme.
export const MaterialPalenightHighlightStyle = HighlightStyle.define([
  {tag: t.keyword, color: '#c792ea'},
  {tag: t.operator, color: '#89ddff'},
  {tag: t.special(t.variableName), color: '#eeffff'},
  {tag: t.typeName, color: '#f07178'},
  {tag: t.atom, color: '#f78c6c'},
  {tag: t.number, color: '#ff5370'},
  {tag: t.definition(t.variableName), color: '#82aaff'},
  {tag: t.string, color: '#c3e88d'},
  {tag: t.special(t.string), color: '#f07178'},
  {tag: t.comment, color: stone},
  {tag: t.variableName, color: '#f07178'},
  {tag: t.tagName, color: '#ff5370'},
  {tag: t.bracket, color: '#a2a1a4'},
  {tag: t.meta, color: '#ffcb6b'},
  {tag: t.attributeName, color: '#c792ea'},
  {tag: t.propertyName, color: '#c792ea'},
  {tag: t.className, color: '#decb6b'},
  {tag: t.invalid, color: invalid},
]);
