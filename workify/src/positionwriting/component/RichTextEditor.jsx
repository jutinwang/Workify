import { useCallback, useMemo } from "react";
import { createEditor, Editor, Transforms, Element as SlateElement } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import isHotkey from "is-hotkey";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

// Key shortcuts for stylings
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "mod+-": "strikethrough",
  "mod+.": "bulleted-list",
  "mod+/": "numbered-list"
};

// different kinds of lists
const LIST_TYPES = ["numbered-list", "bulleted-list"];

// used for applying non element attribute changes
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// used for applying different element changes 
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  const newType = isActive ? "paragraph" : isList ? "list-item" : format;

  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  );
  return !!match;
};

// Element renderer
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "code":
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes}>
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol {...attributes}>
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li {...attributes}>
          {children}
        </li>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

// Leaf renderer
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;

  return <span {...attributes}>{children}</span>;
};

// Main RichTextEditor Component
const RichTextEditor = ({ 
  placeholder = "",
  className = "infoInput"
}) => {
  // declared so text can be edited with stylings 
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback((props) => <Element {...props} />, []); // create text format
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []); // create text contents with stylings

  const initialValue = [
    {
      type: "paragraph", // block level (element)
      children: [{ text: "Write your co-op description here..." }], // leaf aka text content
    },
  ];

  return (
    <Slate editor={editor} initialValue={initialValue}>
      {/* Toolbar with buttons */}
      <div className="toolbar">
        <FormatBoldIcon 
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "bold");
          }}
          style={{ cursor: 'pointer' }}
        />
        <FormatItalicIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "italic");
          }}
          style={{ cursor: 'pointer' }}
        />
        <FormatUnderlinedIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "underline");
          }}
          style={{ cursor: 'pointer' }}
        />
        <CodeIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "code");
          }}
          style={{ cursor: 'pointer' }}
        />
        <StrikethroughSIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, "strikethrough");
          }}
          style={{ cursor: 'pointer' }}
        />
        <FormatListBulletedIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "bulleted-list");
          }}
          style={{ cursor: 'pointer' }}
        />
        <FormatListNumberedIcon
          fontSize="small"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "numbered-list");
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <Editable
        className={className}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              if (LIST_TYPES.includes(mark)) {
                toggleBlock(editor, mark);
              } else {
                toggleMark(editor, mark);
              }
            }
          }
        }}
      />
    </Slate>
  );
};

export default RichTextEditor;