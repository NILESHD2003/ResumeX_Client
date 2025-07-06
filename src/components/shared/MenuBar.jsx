import React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
} from "lucide-react";

function MenuBar({ editor }) {
  if (!editor) return null;

  const getBtnClass = (isActive) =>
    `p-2 border rounded hover:bg-gray-700 ${
      isActive ? "bg-gray-700 border-blue-500 text-blue-400" : ""
    }`;

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getBtnClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getBtnClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getBtnClass(editor.isActive("underline"))}
        title="Underline"
      >
        <Underline size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getBtnClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getBtnClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="relative group">
        <button
          className={`p-2 border rounded hover:bg-gray-700 ${
            ["left", "center", "right", "justify"].some((dir) =>
              editor.isActive({ textAlign: dir })
            )
              ? "bg-gray-700 border-blue-500 text-blue-400"
              : ""
          }`}
          title="Alignment"
        >
          <AlignLeft size={18} />
        </button>

        <div className="absolute hidden group-hover:flex flex-col top-10 left-0 bg-gray-800 border border-gray-700 rounded shadow z-10">
          {["left", "center", "right", "justify"].map((dir) => {
            const Icon =
              dir === "left"
                ? AlignLeft
                : dir === "center"
                ? AlignCenter
                : dir === "right"
                ? AlignRight
                : AlignJustify;
            return (
              <button
                key={dir}
                onClick={() =>
                  editor.chain().focus().setTextAlign(dir).run()
                }
                className={`p-2 hover:bg-gray-700 flex items-center gap-2 ${
                  editor.isActive({ textAlign: dir })
                    ? "bg-gray-700 border-l-2 border-blue-500"
                    : ""
                }`}
              >
                <Icon size={16} /> {dir.charAt(0).toUpperCase() + dir.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MenuBar;