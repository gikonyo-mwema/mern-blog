// editorConfig.js
import ReactQuill from 'react-quill';
import hljs from 'highlight.js';

// Configure sizes
const Size = ReactQuill.Quill.import('formats/size');
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
ReactQuill.Quill.register(Size, true);

// Configure fonts
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
ReactQuill.Quill.register(Font, true);

const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
};

const addResizeHandlers = (imgElement, editor, index) => {
  const resizer = document.createElement('div');
  resizer.className = 'absolute inset-0 w-full h-full cursor-default';

  const handle = document.createElement('div');
  handle.className = 'absolute border-2 border-white rounded-sm cursor-se-resize';
  handle.style.cssText = `
    right: -6px;
    bottom: -6px;
    width: 12px;
    height: 12px;
    background-color: #4285f4;
  `;

  resizer.appendChild(handle);
  imgElement.parentNode.insertBefore(resizer, imgElement);

  let startX, startWidth;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startWidth = imgElement.width;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  });

  const resize = (e) => {
    const deltaX = e.clientX - startX;
    const newWidth = startWidth + deltaX;
    imgElement.width = newWidth;
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);

    setTimeout(() => {
      const delta = editor.getContents(index, 1);
      editor.deleteText(index, 1);
      editor.insertEmbed(index, 'image', imgElement.src, {
        width: imgElement.width,
        height: imgElement.height
      });
    }, 0);
  };
};

const modules = {
  toolbar: {
    container: [
      [
        { 'header': [1, 2, 3, 4, 5, 6, false] },
        { 'font': Font.whitelist },
        { 'size': Size.whitelist },
        'bold', 'italic', 'underline', 'strike',
        { 'color': [] }, { 'background': [] },
        { 'script': 'super' }, { 'script': 'sub' }
      ],
      [
        { 'align': [] },
        { 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' },
        'blockquote', 'code-block',
        'link', 'image', 'video', 'table',
        'clean'
      ]
    ],
    handlers: {
      image: imageHandler
    }
  },
  clipboard: {
    matchVisual: false,
  },
  syntax: {
    highlight: text => hljs.highlightAuto(text).value
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'align', 'list', 'bullet', 'indent',
  'blockquote', 'code-block',
  'link', 'image', 'video', 'table'
];

const editorStyles = `
  .ql-snow .ql-toolbar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px 8px 0 0;
  }
  .ql-toolbar-group {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    margin-right: 8px;
  }
  .ql-snow .ql-toolbar button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .ql-snow .ql-toolbar button:hover {
    background: #e2e8f0;
  }
  .ql-snow .ql-toolbar button.ql-active {
    background: #cbd5e1;
  }
  .ql-snow .ql-picker {
    height: 32px;
    margin-right: 4px;
  }
  .ql-snow .ql-picker-label {
    padding: 0 8px;
  }
  .ql-snow .ql-stroke {
    stroke-width: 2;
  }
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    width: 18px;
    height: 18px;
  }
  .ql-container.ql-snow {
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    font-family: inherit;
  }
  .ql-editor {
    min-height: 300px;
    font-size: 16px;
    line-height: 1.6;
  }
  .ql-image-resizable {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  .ql-image-resizer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

export { 
  modules, 
  formats, 
  imageHandler, 
  addResizeHandlers, 
  editorStyles,
  Font,
  Size
};