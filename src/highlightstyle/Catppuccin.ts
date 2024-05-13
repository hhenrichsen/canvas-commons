import {Colors} from '@Colors';
import {HighlightStyle} from '@codemirror/language';
import {tags as t} from '@lezer/highlight';

export const CatppuccinMochHighlightStyle: HighlightStyle =
  HighlightStyle.define([
    {tag: t.keyword, color: Colors.Catppuccin.Mocha.Mauve},
    {tag: t.operator, color: Colors.Catppuccin.Mocha.Sky},
    {tag: t.special(t.variableName), color: Colors.Catppuccin.Mocha.Red},
    {tag: t.typeName, color: Colors.Catppuccin.Mocha.Yellow},
    {tag: t.atom, color: Colors.Catppuccin.Mocha.Red},
    {tag: t.number, color: Colors.Catppuccin.Mocha.Peach},
    {tag: t.definition(t.variableName), color: Colors.Catppuccin.Mocha.Text},
    {tag: t.string, color: Colors.Catppuccin.Mocha.Green},
    {tag: t.special(t.string), color: Colors.Catppuccin.Mocha.Green},
    {tag: t.comment, color: Colors.Catppuccin.Mocha.Overlay2},
    {tag: t.variableName, color: Colors.Catppuccin.Mocha.Text},
    {tag: t.tagName, color: Colors.Catppuccin.Mocha.Red},
    {tag: t.bracket, color: Colors.Catppuccin.Mocha.Overlay2},
    {tag: t.meta, color: Colors.Catppuccin.Mocha.Overlay2},
    {tag: t.punctuation, color: Colors.Catppuccin.Mocha.Overlay2},
    {tag: t.attributeName, color: Colors.Catppuccin.Mocha.Red},
    {tag: t.propertyName, color: Colors.Catppuccin.Mocha.Blue},
    {tag: t.className, color: Colors.Catppuccin.Mocha.Yellow},
    {tag: t.invalid, color: Colors.Catppuccin.Mocha.Red},
    {
      tag: t.function(t.variableName),
      color: Colors.Catppuccin.Mocha.Blue,
    },
    {
      tag: t.function(t.propertyName),
      color: Colors.Catppuccin.Mocha.Blue,
    },
    {
      tag: t.definition(t.function(t.variableName)),
      color: Colors.Catppuccin.Mocha.Blue,
    },
  ]);
