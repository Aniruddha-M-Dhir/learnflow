'use client';

import * as React from 'react';
import type { Value, TElement } from 'platejs';
import { Plate, PlateContent, usePlateEditor, ParagraphPlugin } from 'platejs/react';

import {
  BlockquotePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  HorizontalRulePlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
} from '@platejs/basic-nodes/react';

import { LinkPlugin } from '@platejs/link/react';
import { ListPlugin } from '@platejs/list/react';
import { IndentPlugin } from '@platejs/indent/react';

type EditorProps = {
  initialValue?: string; // JSON string (Value = TElement[])
  onChange?: (value: Value) => void;
};

export default function Editor({ initialValue, onChange }: EditorProps) {
  const value: Value = initialValue
    ? (JSON.parse(initialValue) as TElement[])
    : [{ type: 'p', children: [{ text: '' }] }];

  const editor = usePlateEditor({
    plugins: [
      // Marks
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,

      // Blocks
      ParagraphPlugin,
      H1Plugin,
      H2Plugin,
      H3Plugin,
      BlockquotePlugin,
      HorizontalRulePlugin,

      // Lists / indent / links
      IndentPlugin,
      ListPlugin,
      LinkPlugin,
    ],
    value,
  });

  return (
    <Plate editor={editor} onChange={({ value }) => onChange?.(value)}>
      <PlateContent
        className="min-h-[400px] w-full rounded-md border border-input bg-white p-4 text-sm shadow-sm"
        placeholder="Type your content here..."
      />
    </Plate>
  );
}
